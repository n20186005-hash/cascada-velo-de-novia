/* Inicialización: idioma, traducciones, clima y Service Worker */
(function () {
  "use strict";

  var LANGS = ["es", "zh", "en"];
  var dict = window.CVDN_I18N || { zh: {}, en: {} };
  var esCache = new Map(); /* innerHTML original (es) por elemento */
  var defaultTitle = document.title;
  var defaultDesc = "";
  var metaDesc = document.querySelector('meta[name="description"]');

  function getLang() {
    var url = new URL(location.href);
    var fromUrl = url.searchParams.get("lang");
    if (fromUrl && LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    var saved = null;
    try { saved = localStorage.getItem("cvdn-lang"); } catch (e) { saved = null; }
    return saved && LANGS.indexOf(saved) !== -1 ? saved : "es";
  }

  function setUrlParam(lang) {
    try {
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url.toString());
    } catch (e) { /* sin URL soportada */ }
  }

  function captureEs() {
    var nodes = document.querySelectorAll("[data-t]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!esCache.has(el)) esCache.set(el, el.innerHTML);
    }
  }

  function translate(lang) {
    var dictFor = dict[lang] || {};
    var nodes = document.querySelectorAll("[data-t]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-t");
      if (!key) continue;
      if (lang === "es") {
        if (esCache.has(el)) el.innerHTML = esCache.get(el);
      } else if (Object.prototype.hasOwnProperty.call(dictFor, key)) {
        el.innerHTML = dictFor[key];
      }
    }
  }

  function applyLang(lang) {
    var root = document.documentElement;
    root.setAttribute("lang", lang);
    document.body.setAttribute("data-lang", lang);

    var buttons = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    }

    translate(lang);

    /* Título y descripción */
    var t = (dict[lang] && dict[lang]._title) || "";
    var d = (dict[lang] && dict[lang]._desc) || "";
    document.title = t || defaultTitle;
    if (metaDesc) metaDesc.setAttribute("content", d || defaultDesc);

    try { localStorage.setItem("cvdn-lang", lang); } catch (e) { /* ignorar */ }
    setUrlParam(lang);

    if (window.CVDNWeather) window.CVDNWeather.setLang(lang);
  }

  function bind() {
    var buttons = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        applyLang(this.getAttribute("data-lang"));
      });
    }
  }

  function initWeather(lang) {
    if (window.CVDNWeather) window.CVDNWeather.init(lang);
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    var isLocal = /^https?:$/.test(location.protocol) &&
      (location.hostname === "localhost" || location.hostname === "127.0.0.1");
    if (location.protocol === "https:" || isLocal) {
      navigator.serviceWorker.register("/sw.js").catch(function () { /* sin SW disponible */ });
    }
  }

  function boot() {
    if (metaDesc) defaultDesc = metaDesc.getAttribute("content");
    captureEs();
    var lang = getLang();
    applyLang(lang);
    bind();
    initWeather(lang);
    registerSW();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
