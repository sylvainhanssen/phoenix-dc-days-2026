
const CACHE_NAME = 'phoenix-dc-days-2026-v1';
const PRECACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
    ))
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return; // don't cache POST etc.
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(networkResp => {
        // Update cache with latest copy for same-origin requests
        if (networkResp && req.url.startsWith(self.location.origin)) {
          const copy = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return networkResp;
      }).catch(() => cached); // offline fallback to cache
      return cached || fetchPromise;
    })
  );
});
