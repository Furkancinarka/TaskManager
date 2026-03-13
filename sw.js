// ===== RecurKit Service Worker =====
const CACHE_NAME = 'recurkit-v12';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/privacy.html',
  '/styles.css',
  '/i18n.js',
  '/helpers.js',
  '/storage.js',
  '/tasks.js',
  '/notifications.js',
  '/ui.js',
  '/onboarding.js',
  '/pwa.js',
  '/app.js',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install — cache all static assets
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache first, fall back to network
self.addEventListener('fetch', function (e) {
  // Skip non-GET and cross-origin requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) {
        // Return cached, but also update cache in background
        var fetchPromise = fetch(e.request).then(function (response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(e.request, clone);
            });
          }
          return response;
        }).catch(function () { /* offline, ignore */ });

        return cached;
      }

      return fetch(e.request).then(function (response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      });
    })
  );
});

