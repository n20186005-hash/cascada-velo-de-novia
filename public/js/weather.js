/* Módulo de clima: consulta /api/weather y genera consejos prácticos. */
(function () {
  "use strict";

  var L = {
    es: {
      loading: "Consultando el tiempo…",
      error: "Ahora mismo no pudimos obtener el clima. Revisa tu conexión e inténtalo en unos minutos.",
      retry: "Reintentar",
      nowTitle: "Ahora en la cascada",
      feels: "Sensación",
      wind: "Viento",
      gust: "Ráfagas",
      uv: "Índice UV",
      hum: "Humedad",
      rainDay: "Prob. de lluvia hoy",
      forecast: "Pronóstico de los próximos 7 días",
      updated: "Actualizado",
      dayToday: "Hoy",
      dayTomorrow: "Mañana",
      monday: "Lunes", tuesday: "Martes", wednesday: "Miércoles", thursday: "Jueves",
      friday: "Viernes", saturday: "Sábado", sunday: "Domingo",
      months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      // tarjetas de consejo
      wearTitle: "Qué ponerse",
      doTitle: "Qué hacer",
      gearTitle: "Qué llevar",
      riskTitle: "Avisos de seguridad",
      noAlert: "Sin avisos meteorológicos activos en la zona.",
      noAdvice: "Sin recomendaciones especiales.",
      // estados del cielo
      c_clear: "Despejado", c_mostly: "Mayormente despejado", c_partly: "Parcialmente nublado",
      c_overcast: "Nublado", c_fog: "Niebla", c_drizzle: "Llovizna", c_rain: "Lluvia",
      c_heavyrain: "Lluvia fuerte", c_showers: "Chubascos", c_heavyshower: "Chubascos fuertes",
      c_snow: "Nieve", c_thunder: "Tormenta eléctrica",
      // reglas
      r_thunder: "Si truena, aléjate del agua, de los árboles aislados y de zonas abiertas; no subas a los miradores altos.",
      r_heavy: "Lluvia intensa: evita la cañada y las zonas bajas (riesgo de crecida súbita) y no cruces arroyos.",
      r_wind: "Viento fuerte: mantente alejado de acantilados, ramas caídas y estructuras sueltas en el mirador.",
      r_fog: "Niebla: visibilidad reducida en senderos y en el último tramo del camino rural; conduce con precaución.",
      r_flash: "Posibilidad de lluvias: vigila el cielo; si el río sube de golpe, sal de la cañada.",
      w_warm: "Calor intenso: elige ropa ligera y transpirable y camina en las horas frescas.",
      w_layers: "Día con amplitud térmica grande: lleva capas y una chamarra para la mañana o la noche.",
      w_cold: "Temperatura baja: abrígate bien antes de salir.",
      w_rain: "Probabilidad de lluvia: calzado cerrado e impermeable o prendas que sequen rápido.",
      d_clear: "Día despejado: perfecto para senderismo, miradores y fotos de amanecer o atardecer.",
      d_overcast: "Luz difusa y suave: muy buena para fotografiar la cascada y el bosque.",
      d_rain: "Con lluvia el piso y la roca resbalan: extrema precaución; las actividades guiadas pueden suspenderse.",
      d_morning: "Plan temprano (6:00–9:00): suele llover por la tarde en esta zona.",
      d_noon: "Evita el sol del mediodía en los tramos sin sombra.",
      d_windy: "Viento moderado a fuerte: ponte un gorro que no vuele y evita ropa muy holgada.",
      g_umbrella: "Sombrilla o impermeable ligero.",
      g_raincoat: "Impermeable o poncho (mejor que sombrilla si hay viento).",
      g_sun: "Protector solar, lentes de sol y gorra.",
      g_water: "Agua suficiente (1–1.5 L por persona).",
      g_shoes: "Calzado cerrado antiderrapante.",
      g_cash: "Efectivo para cooperación, estacionamiento y refrigerios.",
      g_warm: "Chamarra o capa extra.",
      none_wear: "Ropa cómoda de caminar; está fresca la montaña.",
      none_do: "Condiciones favorables: sin restricciones especiales.",
      none_gear: "Lo esencial: agua, efectivo y cámara.",
      tC: "°C",
      kmh: "km/h",
      noData: "—"
    },
    zh: {
      loading: "正在获取天气…",
      error: "暂时无法获取天气数据。请检查网络后重试。",
      retry: "重试",
      nowTitle: "瀑布当前天气",
      feels: "体感温度",
      wind: "风速",
      gust: "阵风",
      uv: "紫外线指数",
      hum: "湿度",
      rainDay: "今日降水概率",
      forecast: "未来 7 天预报",
      updated: "更新于",
      dayToday: "今天",
      dayTomorrow: "明天",
      monday: "星期一", tuesday: "星期二", wednesday: "星期三", thursday: "星期四",
      friday: "星期五", saturday: "星期六", sunday: "星期日",
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      wearTitle: "出行穿搭",
      doTitle: "游玩安排",
      gearTitle: "随身物品",
      riskTitle: "风险提醒",
      noAlert: "当前无气象预警。",
      noAdvice: "无特殊建议。",
      c_clear: "晴朗", c_mostly: "大致晴朗", c_partly: "多云间晴",
      c_overcast: "阴天", c_fog: "有雾", c_drizzle: "毛毛雨", c_rain: "小雨",
      c_heavyrain: "大雨", c_showers: "阵雨", c_heavyshower: "强阵雨",
      c_snow: "下雪", c_thunder: "雷暴",
      r_thunder: "雷雨时请远离水面、孤立树木和开阔地带，不要登高到上层观景台。",
      r_heavy: "降雨较强：请避开峡谷与低洼地带（警惕山洪），不要涉水过溪。",
      r_wind: "风力较大：观景台注意远离崖边、断枝和松动设施。",
      r_fog: "有雾：步道及乡村道路能见度低，开车请减速慢行。",
      r_flash: "有降雨可能：留意天色；若溪水骤涨，请立刻离开峡谷。",
      w_warm: "天气炎热：穿轻薄透气衣物，尽量避开正午高温时段。",
      w_layers: "昼夜温差大：建议备一件外套方便增减。",
      w_cold: "气温偏低：出门前做好保暖。",
      w_rain: "有降雨概率：穿防滑封闭鞋，带防水或快干衣物。",
      d_clear: "天气晴好：适合徒步、观景与拍摄日出日落。",
      d_overcast: "光线柔和均匀：很适合拍摄瀑布与森林。",
      d_rain: "下雨时地面与岩石湿滑：请格外小心；向导类活动可能暂停。",
      d_morning: "建议清晨（6:00–9:00）出发：该区域午后常有雨。",
      d_noon: "避开正午暴晒路段。",
      d_windy: "风较大：戴不易被吹走的帽子，少穿宽松衣物。",
      g_umbrella: "折叠伞或轻便雨衣。",
      g_raincoat: "雨衣或雨披（风大时不建议长柄伞）。",
      g_sun: "防晒霜、墨镜、遮阳帽。",
      g_water: "充足饮用水（每人 1–1.5 升）。",
      g_shoes: "防滑封闭鞋。",
      g_cash: "现金（维护费、停车与零食）。",
      g_warm: "外套或备用衣物。",
      none_wear: "穿舒适徒步服装；山区体感偏凉。",
      none_do: "天气条件良好，无特殊限制。",
      none_gear: "带上基本物品：水、现金和相机。",
      tC: "°C",
      kmh: "公里/时",
      noData: "—"
    },
    en: {
      loading: "Checking the weather…",
      error: "We couldn't fetch the weather right now. Check your connection and try again in a few minutes.",
      retry: "Retry",
      nowTitle: "At the falls right now",
      feels: "Feels like",
      wind: "Wind",
      gust: "Gusts",
      uv: "UV index",
      hum: "Humidity",
      rainDay: "Rain chance today",
      forecast: "7-day forecast",
      updated: "Updated",
      dayToday: "Today",
      dayTomorrow: "Tomorrow",
      monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
      friday: "Friday", saturday: "Saturday", sunday: "Sunday",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      wearTitle: "What to wear",
      doTitle: "What to do",
      gearTitle: "What to pack",
      riskTitle: "Safety alerts",
      noAlert: "No active weather alerts for the area.",
      noAdvice: "No special recommendations.",
      c_clear: "Clear", c_mostly: "Mostly clear", c_partly: "Partly cloudy",
      c_overcast: "Overcast", c_fog: "Fog", c_drizzle: "Drizzle", c_rain: "Rain",
      c_heavyrain: "Heavy rain", c_showers: "Showers", c_heavyshower: "Heavy showers",
      c_snow: "Snow", c_thunder: "Thunderstorm",
      r_thunder: "If it thunders, move away from water, isolated trees and open areas; do not climb to the upper viewpoints.",
      r_heavy: "Heavy rain: avoid the ravine and low areas (flash-flood risk) and never cross streams.",
      r_wind: "Strong wind: keep away from cliff edges, fallen branches and loose structures on the viewpoint.",
      r_fog: "Fog: low visibility on trails and the last stretch of rural road – drive carefully.",
      r_flash: "Rain possible: keep an eye on the sky; if the stream rises suddenly, leave the ravine.",
      w_warm: "Hot: choose light, breathable clothes and hike during the cooler hours.",
      w_layers: "Big temperature swing today: wear layers and carry a light jacket for morning or night.",
      w_cold: "Low temperatures: wrap up warm before you go.",
      w_rain: "Rain likely: closed non-slip shoes and waterproof or quick-dry clothing.",
      d_clear: "Clear day: perfect for hiking, viewpoints and sunrise/sunset photos.",
      d_overcast: "Soft, even light: great for photographing the falls and the forest.",
      d_rain: "Wet ground and rocks are slippery: take extra care; guided activities may be suspended.",
      d_morning: "Plan early (6:00–9:00): this area usually sees afternoon rain.",
      d_noon: "Avoid midday sun on exposed trail sections.",
      d_windy: "Moderate to strong wind: wear a hat that won't blow off and avoid loose clothing.",
      g_umbrella: "Umbrella or light raincoat.",
      g_raincoat: "Raincoat or poncho (better than an umbrella in wind).",
      g_sun: "Sunscreen, sunglasses and a hat.",
      g_water: "Plenty of water (1–1.5 L per person).",
      g_shoes: "Closed non-slip shoes.",
      g_cash: "Cash for the donation, parking and snacks.",
      g_warm: "Extra jacket or layer.",
      none_wear: "Comfortable hiking clothes; the mountain feels cool.",
      none_do: "Conditions look good – no special restrictions.",
      none_gear: "The essentials: water, cash and a camera.",
      tC: "°C",
      kmh: "km/h",
      noData: "—"
    }
  };

  function t(l, k) { return (L[l] && L[l][k]) || (L.es && L.es[k]) || k; }

  /* Códigos WMO → categoría + icono */
  var CAT = {
    clear: [0],
    mostly: [1],
    partly: [2],
    overcast: [3],
    fog: [45, 48],
    drizzle: [51, 53, 55, 56, 57],
    rain: [61, 66, 67, 80],
    heavyrain: [63, 65, 82],
    showers: [81],
    heavyshower: [82],
    snow: [71, 73, 75, 77, 85, 86],
    thunder: [95, 96, 99]
  };
  var ICON = {
    clear: "☀️", mostly: "🌤️", partly: "⛅", overcast: "☁️", fog: "🌫️",
    drizzle: "🌦️", rain: "🌧️", heavyrain: "🌧️", showers: "🌦️",
    heavyshower: "🌧️", snow: "🌨️", thunder: "⛈️"
  };

  function codeCat(code) {
    if (code == null) return null;
    for (var c in CAT) {
      if (CAT[c].indexOf(code) !== -1) return c;
    }
    return null;
  }

  function labelFor(lang, cat) {
    if (!cat) return t(lang, "noData");
    var key = "c_" + cat;
    return L[lang] && L[lang][key] ? L[lang][key] : L.es[key];
  }

  function nightIcon(lang, cat, isDay) {
    if (cat === "clear" && !isDay) return "🌙";
    return ICON[cat] || "🌡️";
  }

  function weekday(lang, iso) {
    var dt = new Date(iso + "T12:00:00");
    var base = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return L[lang][base[dt.getDay()]];
  }

  function shortDate(lang, iso) {
    var dt = new Date(iso + "T12:00:00");
    return dt.getDate() + " " + t(lang, "months")[dt.getMonth()];
  }

  function dayKey(lang, iso, todayIso) {
    if (iso === todayIso) return t(lang, "dayToday");
    var today = new Date(todayIso + "T12:00:00");
    var next = new Date(today.getTime() + 86400000);
    var nextIso = next.toISOString().slice(0, 10);
    if (iso === nextIso) return t(lang, "dayTomorrow");
    return weekday(lang, iso);
  }

  function num(v) { return v == null || isNaN(v) ? null : v; }

  /* ---------- Motor de consejos ---------- */
  function buildAdvice(cur, today, lang) {
    var items = { risk: [], wear: [], do: [], gear: [] };
    var has = function (arr) { return arr.length > 0; };
    function add(kind, key) {
      var v = L[lang] && L[lang][key];
      if (v && items[kind].indexOf(v) === -1) items[kind].push(v);
    }

    var catNow = codeCat(cur && cur.code);
    var catToday = codeCat(today && today.code);
    var tmax = num(today && today.tmax);
    var tmin = num(today && today.tmin);
    var pop = num(today && today.pop);
    var temp = num(cur && cur.temp);
    var uv = num(cur && cur.uv != null ? cur.uv : (today && today.uv));
    var wind = num(cur && cur.wind);
    var gust = num(cur && cur.gust);

    /* 1. Tormenta */
    if (catToday === "thunder" || catNow === "thunder") {
      add("risk", "r_thunder");
      add("do", "d_morning");
      items.wear = [];
      items.gear = [];
    }
    /* 2. Lluvia fuerte / chubascos fuertes */
    if (catToday === "heavyrain" || catToday === "heavyshower" || catToday === "heavyrain") {
      add("risk", "r_heavy");
      add("do", "d_rain");
      add("gear", "g_raincoat");
    }
    /* 3. Lluvia / llovizna / chubascos */
    if (catToday === "rain" || catToday === "drizzle" || catToday === "showers") {
      add("wear", "w_rain");
      add("do", "d_rain");
      add("gear", "g_umbrella");
    }
    /* 4. Niebla */
    if (catToday === "fog" || catNow === "fog") add("risk", "r_fog");
    /* 5. Viento */
    if (wind != null && wind >= 61) add("risk", "r_wind");
    else if (wind != null && wind >= 39) add("do", "d_windy");
    if (gust != null && gust >= 75 && items.risk.indexOf(t(lang, "r_wind")) === -1) add("risk", "r_wind");
    /* 6. Calor */
    if (temp != null && temp >= 32) {
      add("wear", "w_warm");
      add("do", "d_noon");
      add("gear", "g_sun");
      add("gear", "g_water");
    }
    /* 7. UV */
    if (uv != null && uv >= 5) add("gear", "g_sun");
    /* 8. Frío */
    if (tmax != null && tmax <= 10) {
      add("wear", "w_cold");
      add("gear", "g_warm");
    }
    /* 9. Amplitud térmica */
    if (tmax != null && tmin != null && tmax - tmin > 8) add("wear", "w_layers");
    /* 10. Probabilidad de lluvia */
    if (pop != null) {
      if (pop >= 60) {
        add("gear", "g_umbrella");
        add("risk", "r_flash");
      } else if (pop >= 40) {
        add("gear", "g_umbrella");
        add("do", "d_morning");
      }
    }
    /* 11. Condición general */
    if (catToday === "clear") add("do", "d_clear");
    else if (catToday === "mostly" || catToday === "partly" || catToday === "overcast") add("do", "d_overcast");
    if (items.risk.length === 0 && has(items.do) === false && items.wear.length === 0 && items.gear.length === 0) {
      add("do", "none_do");
    }
    /* Rellenos básicos siempre útiles */
    add("wear", "none_wear");
    add("gear", "g_shoes");
    add("gear", "g_water");
    add("gear", "g_cash");
    return items;
  }

  function sortAdvice(items) {
    /* en wear/do/gear: deduplicar y limitar a 4 */
    var out = { risk: items.risk, wear: [], do: [], gear: [] };
    var lists = { wear: items.wear, do: items.do, gear: items.gear };
    Object.keys(lists).forEach(function (k) {
      var seen = {};
      var arr = lists[k];
      var n = 0;
      for (var i = 0; i < arr.length && n < 4; i++) {
        if (arr[i] && !seen[arr[i]]) { seen[arr[i]] = true; out[k].push(arr[i]); n++; }
      }
    });
    return out;
  }

  /* ---------- Render ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderCurrent(lang, p) {
    var c = p.current || {};
    var today = (p.daily && p.daily[0]) || {};
    var cat = codeCat(c.code != null ? c.code : today.code);
    var icon = nightIcon(lang, cat, c.is_day);
    var d0 = document.createElement("div");
    d0.className = "w-now";
    d0.innerHTML =
      '<div class="w-now-left">' +
      '<span class="w-now-icon" aria-hidden="true">' + icon + '</span>' +
      '<div>' +
      '<div class="w-now-temp">' + esc(num(c.temp) != null ? c.temp + t(lang, "tC") : t(lang, "noData")) + '</div>' +
      '<div class="w-now-desc">' + esc(labelFor(lang, cat)) + '</div>' +
      '<div class="w-now-sub">' + esc((c.time || "").slice(0, 16).replace("T", " · ")) + '</div>' +
      '</div>' +
      '</div>' +
      '<ul class="w-kpis">' +
      kpi(lang, "feels", num(c.feels) != null ? c.feels + t(lang, "tC") : "—") +
      kpi(lang, "rainDay", num(today.pop) != null ? today.pop + " %" : "—") +
      kpi(lang, "hum", num(c.humidity) != null ? c.humidity + " %" : "—") +
      kpi(lang, "wind", num(c.wind) != null ? c.wind + " " + t(lang, "kmh") : "—") +
      kpi(lang, "gust", num(c.gust) != null ? c.gust + " " + t(lang, "kmh") : "—") +
      kpi(lang, "uv", num(c.uv) != null ? c.uv : "—") +
      '</ul>';
    return d0.outerHTML;
  }
  function kpi(lang, k, val) {
    var label = t(lang, k);
    return '<li class="w-kpi"><span>' + esc(label) + '</span><strong>' + esc(val) + '</strong></li>';
  }

  function renderAdvice(lang, cur, today) {
    var items = sortAdvice(buildAdvice(cur, today, lang));
    var html = "";
    /* Banner de riesgo */
    if (items.risk.length) {
      html += '<div class="w-risk"><strong>⚠️ ' + esc(t(lang, "riskTitle")) + '</strong><ul>';
      items.risk.forEach(function (m) { html += "<li>" + esc(m) + "</li>"; });
      html += "</ul></div>";
    } else {
      html += '<p class="weather-update ok">✅ ' + esc(t(lang, "noAlert")) + "</p>";
    }
    html += '<div class="advice-tabs">' +
      adviceCard(lang, "wearTitle", "wear", items.wear) +
      adviceCard(lang, "doTitle", "do", items.do) +
      adviceCard(lang, "gearTitle", "gear", items.gear) +
      "</div>";
    return html;
  }

  function adviceCard(lang, titleKey, kind, list) {
    var body = list.length
      ? "<ul>" + list.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>"
      : '<p class="advice-empty">' + esc(t(lang, "noAdvice")) + "</p>";
    return '<div class="advice-card"><h4>' + esc(t(lang, titleKey)) + "</h4>" + body + "</div>";
  }

  function renderForecast(lang, p) {
    var days = (p.daily || []).slice(0, 7);
    if (!days.length) return "";
    var todayIso = days[0] && days[0].date;
    var html = '<div class="w-days">';
    days.forEach(function (day, i) {
      var cat = codeCat(day.code);
      var name = i === 0 ? t(lang, "dayToday") : dayKey(lang, day.date, todayIso);
      html +=
        '<div class="w-day' + (i === 0 ? " today" : "") + '">' +
        '<div class="w-day-name">' + esc(name) + '</div>' +
        '<div class="w-day-date">' + esc(shortDate(lang, day.date)) + '</div>' +
        '<div class="w-day-icon" aria-hidden="true">' + nightIcon(lang, cat, true) + '</div>' +
        '<div class="w-day-temp">' + esc(num(day.tmax) != null ? day.tmax + "°" : "—") +
        ' <small>' + esc(num(day.tmin) != null ? day.tmin + "°" : "—") + "</small></div>" +
        '<div class="w-day-meta">' +
        '<span>💧 ' + esc(num(day.pop) != null ? day.pop + "%" : "—") + "</span>" +
        '<span>🌬️ ' + esc(num(day.wind) != null ? day.wind + "" : "—") + "</span>" +
        '<span>☀️ ' + esc(num(day.uv) != null ? day.uv : "—") + "</span>" +
        "</div>" +
        "</div>";
    });
    html += "</div>";
    return html;
  }

  function render(lang, p, root) {
    if (!root) return;
    var html = "";
    if (p && p.ok && p.current && p.daily) {
      html += renderCurrent(lang, p);
      html += renderAdvice(lang, p.current, p.daily[0]);
      html += "<h3>" + esc(t(lang, "forecast")) + "</h3>";
      html += renderForecast(lang, p);
      var upd = (p.updatedAt || "").slice(0, 16).replace("T", " ");
      html += '<p class="weather-update">🕒 ' + esc(t(lang, "updated")) + ": " + esc(upd) + "</p>";
    } else {
      html =
        '<div class="weather-error">' +
        esc(p && p.ok === false ? (p.message || t(lang, "error")) : t(lang, "error")) +
        ' <button type="button" class="btn btn-light" data-wretry>' + esc(t(lang, "retry")) + "</button>" +
        "</div>";
    }
    root.innerHTML = html;
  }

  function fetchData() {
    return fetch("/api/weather", { headers: { Accept: "application/json" } }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    });
  }

  var state = { lang: "es", payload: null, loading: false };

  function init(lang) {
    state.lang = lang || "es";
    var root = document.getElementById("weather-root");
    if (!root) return;
    root.innerHTML = '<div class="weather-loading">' + esc(t(lang, "loading")) + "</div>";
    if (state.payload) {
      render(state.lang, state.payload, root);
      return;
    }
    if (state.loading) return;
    state.loading = true;
    fetchData()
      .then(function (json) {
        state.payload = json;
        state.loading = false;
        render(state.lang, state.payload, root);
      })
      .catch(function () {
        state.loading = false;
        render(state.lang, null, root);
      });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-wretry]") : null;
    if (btn) {
      state.payload = null;
      init(state.lang);
    }
  });

  window.CVDNWeather = { init: init, setLang: function (lang) { state.lang = lang; var root = document.getElementById("weather-root"); if (root && state.payload) render(lang, state.payload, root); } };
})();
