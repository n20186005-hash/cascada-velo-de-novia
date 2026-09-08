/* Servidor local de desarrollo: sirve ./public y proxy de /api/weather (para probar UI) */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public");
const PORT = process.env.PORT || 8123;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const LAT = 19.1640919;
const LON = -100.4470019;

async function weatherProxy() {
  const p = new URLSearchParams({
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
  const url = `https://api.open-meteo.com/v1/forecast?${p.toString()}`;
  const res = await fetch(url, { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(9000) });
  const raw = await res.json();
  const c = raw.current || {};
  const d = raw.daily || {};
  const days = Array.isArray(d.time) ? d.time.map((date, i) => ({
    date,
    code: d.weather_code && d.weather_code[i],
    tmax: d.temperature_2m_max && Math.round(d.temperature_2m_max[i]),
    tmin: d.temperature_2m_min && Math.round(d.temperature_2m_min[i]),
    pop: d.precipitation_probability_max && d.precipitation_probability_max[i],
    rain_mm: d.precipitation_sum ? Math.round(d.precipitation_sum[i] * 10) / 10 : 0,
    wind: d.wind_speed_10m_max && Math.round(d.wind_speed_10m_max[i]),
    uv: d.uv_index_max ? Math.round(d.uv_index_max[i] * 10) / 10 : null,
    sunrise: d.sunrise && d.sunrise[i],
    sunset: d.sunset && d.sunset[i],
  })) : [];
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

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    if (url.pathname === "/api/weather") {
      try {
        const data = await weatherProxy();
        send(res, 200, JSON.stringify(data), "application/json; charset=utf-8");
      } catch (e) {
        send(res, 503, JSON.stringify({ ok: false, message: "proxy error" }), "application/json; charset=utf-8");
      }
      return;
    }
    let p = decodeURIComponent(url.pathname);
    if (p === "/") p = "/index.html";
    const file = path.normalize(path.join(ROOT, p));
    if (!file.startsWith(ROOT)) { send(res, 403, "forbidden", "text/plain"); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { send(res, 404, "not found", "text/plain"); return; }
      const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
      res.end(buf);
    });
  } catch (e) {
    send(res, 500, "server error", "text/plain");
  }
});

server.listen(PORT, () => console.log("dev server on http://localhost:" + PORT));
