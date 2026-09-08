/**
 * Worker para cascadavelodenovia.com
 * - Sirve el sitio estático desde el binding de assets de Cloudflare.
 * - Expone GET /api/weather: consulta y cachea el pronóstico del clima
 *   para la Cascada Velo de Novia (19.1640919, -100.4470019).
 */
const LAT = 19.1640919;
const LON = -100.4470019;
const CACHE_TTL_SECONDS = 900; // 15 minutos

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extra },
  });
}

async function fetchWeather() {
  const params = new URLSearchParams({
    latitude: String(LAT),
    longitude: String(LON),
    timezone: "America/Mexico_City",
    forecast_days: "7",
    wind_speed_unit: "kmh",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,uv_index",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset",
  });

  const endpoint = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(endpoint, {
    headers: { "Accept": "application/json", "User-Agent": "cascadavelodenovia-worker/1.0" },
    signal: AbortSignal.timeout(9000),
  });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  return res.json();
}

function buildPayload(raw) {
  const c = raw.current || {};
  const d = raw.daily || {};
  const days = Array.isArray(d.time)
    ? d.time.map((date, i) => ({
        date,
        code: (d.weather_code && d.weather_code[i]) ?? null,
        tmax: Math.round((d.temperature_2m_max && d.temperature_2m_max[i]) ?? NaN),
        tmin: Math.round((d.temperature_2m_min && d.temperature_2m_min[i]) ?? NaN),
        pop: (d.precipitation_probability_max && d.precipitation_probability_max[i]) ?? null,
        rain_mm: Math.round(((d.precipitation_sum && d.precipitation_sum[i]) ?? 0) * 10) / 10,
        wind: Math.round((d.wind_speed_10m_max && d.wind_speed_10m_max[i]) ?? NaN),
        uv: (d.uv_index_max && Math.round(d.uv_index_max[i] * 10) / 10) ?? null,
        sunrise: (d.sunrise && d.sunrise[i]) || null,
        sunset: (d.sunset && d.sunset[i]) || null,
      }))
    : [];

  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    place: { lat: LAT, lon: LON },
    current: {
      time: c.time || null,
      code: c.weather_code ?? null,
      temp: Math.round(c.temperature_2m ?? NaN),
      feels: Math.round(c.apparent_temperature ?? NaN),
      humidity: Math.round(c.relative_humidity_2m ?? NaN),
      is_day: Boolean(c.is_day),
      precip_mm: Math.round((c.precipitation ?? 0) * 10) / 10,
      wind: Math.round(c.wind_speed_10m ?? NaN),
      gust: Math.round(c.wind_gusts_10m ?? NaN),
      uv: c.uv_index != null ? Math.round(c.uv_index * 10) / 10 : null,
    },
    daily: days,
  };
}

async function handleWeather() {
  // Lectura desde la caché del Worker (según Cloudflare).
  const cache = caches.default;
  const cacheKey = new Request("https://cache.local/weather-velo-de-novia-v1", { method: "GET" });
  let cached = null;
  try {
    cached = await cache.match(cacheKey);
  } catch (_) {
    cached = null;
  }
  if (cached) {
    return new Response(cached.body, {
      status: cached.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}`, "X-Weather-Cache": "HIT", "X-Robots-Tag": "noindex" },
    });
  }

  try {
    const raw = await fetchWeather();
    const payload = buildPayload(raw);
    const response = json(payload, 200, {
      ...CORS_HEADERS,
      "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}`,
      "X-Weather-Cache": "MISS",
      "X-Robots-Tag": "noindex",
    });
    try {
      await cache.put(cacheKey, response.clone());
    } catch (_) {
      /* la caché puede no estar disponible en algunos entornos */
    }
    return response;
  } catch (err) {
    return json(
      { ok: false, message: "Temporalmente no disponible. Inténtalo en unos minutos." },
      503,
      { ...CORS_HEADERS, "X-Robots-Tag": "noindex" }
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === "/api/weather" && method === "GET") {
        return handleWeather();
      }
      return json({ ok: false, error: "not_found" }, 404, { ...CORS_HEADERS, "X-Robots-Tag": "noindex" });
    }

    // Solicitudes de rutas amigables (no corresponden a un archivo estático):
    // se devuelve index.html para que el enrutado del cliente funcione.
    if (method === "GET" && !/\.\w{1,8}$/.test(url.pathname)) {
      const asset = await env.ASSETS.fetch(new URL("/index.html", url.origin));
      const html = await asset.text();
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "index,follow" },
      });
    }

    const fallback = await env.ASSETS.fetch(request);
    return fallback;
  },
};
