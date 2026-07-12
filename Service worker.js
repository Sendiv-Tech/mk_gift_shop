'use strict';

/* ==============================================================
   MK GIFT SHOP — SERVICE WORKER
   ==============================================================
   IMPORTANT: Bump CACHE_VERSION every time you deploy changes to
   index.html, script.js, or styles.css. If you don't bump it,
   returning visitors' phones will keep serving the OLD cached
   files even after you update them on the server — this was the
   cause of the mobile menu appearing "fixed" in testing but still
   broken on real devices.
   ============================================================== */
const CACHE_VERSION = 'v2';
const CACHE_NAME = `mk-gift-shop-${CACHE_VERSION}`;

// Only list files that actually exist on your server. Keep this
// list small and stable — core "app shell" only.
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json'
];

/* ---------- INSTALL ----------
   Pre-cache the app shell, then activate immediately (don't wait
   for old tabs to close) so updates roll out fast. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ---------- ACTIVATE ----------
   Delete every cache that isn't the current version, then take
   control of all open tabs immediately. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- FETCH ----------
   Network-first for the app shell (HTML/JS/CSS): always try to
   get the freshest version from the server first, and only fall
   back to cache if the device is offline. This is what prevents
   the "stale JS/CSS on phone" problem going forward.

   Cache-first for everything else (images, fonts, icons): these
   rarely change and benefit from being served instantly. */
const APP_SHELL_EXTENSIONS = ['.html', '.js', '.css'];

function isAppShellRequest(url) {
  return (
    url.pathname === '/' ||
    url.pathname.endsWith('/') ||
    APP_SHELL_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))
  );
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests; let everything else
  // (analytics, fonts CDN, WhatsApp links, etc.) pass through normally.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (isAppShellRequest(url)) {
    // NETWORK-FIRST
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // CACHE-FIRST
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
  }
});