// Service worker: makes the app installable and lets lessons, vocab and practice work offline.
// Bump VERSION whenever you change any app file so phones pick up the new version.
const VERSION = "gre-prep-v2";
const SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/manifest.webmanifest",
  "/js/app.js",
  "/js/merge.js",
  "/js/data/lessons.js",
  "/js/data/questions.js",
  "/js/data/questions-hard.js",
  "/js/data/vocab.js",
  "/js/data/vocab-advanced.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/favicon-32.png",
];
const FONTS = "gre-fonts";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never cache the API: progress and AI must always be live.
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) return;

  // Google Fonts: cache after first load so the app looks right offline.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(FONTS).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === "opaque") c.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Pages: try the network first so updates show up, fall back to the cached app offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // App files: serve from cache instantly, refresh in the background.
  e.respondWith(
    caches.open(VERSION).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req)
        .then((res) => {
          if (res.ok) c.put(req, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
