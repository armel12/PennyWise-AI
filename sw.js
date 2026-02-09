const CACHE_NAME = 'pennywise-v2';

const urlsToCache = [
  '/',
  '/index.html'
];

// Install: cache core files
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 🔥 activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate: clean old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim() // 🔥 control open tabs immediately
    ])
  );
});

// Fetch: network-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
