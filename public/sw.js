/* Service Worker – caché de la guía para acceso sin conexión */
const VERSION = "cvdn-v1";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/main.js",
  "/js/i18n.js",
  "/js/weather.js",
  "/manifest.webmanifest",
  "/images/cascada-velo-de-novia-vista-principal-1.jpg",
  "/images/cascada-velo-de-novia-salto-agua-1.jpg",
  "/images/lago-avandaro-valle-de-bravo-1.jpg",
  "/images/mirador-velo-de-novia-bosque-1.jpg",
  "/images/icon-192.png",
  "/images/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) {
    // El clima siempre se intenta en línea; si falla se informa en la página.
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok && !url.pathname.startsWith("/api/")) {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
          return new Response("", { status: 503, statusText: "Sin conexión" });
        });
      return cached || network;
    })
  );
});
