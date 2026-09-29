const CACHE_NAME = 'hospitalx-offline-v2';
// Assets to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/command',
  '/health-worker',
  '/health-worker/screen',
  '/favicon.svg',
  '/manifest.json'
];
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => console.log('[SW] Pre-caching complete.'))
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  // Clear old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // 1. Bypass Next.js HMR and API requests
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/webpack-hmr')) {
    return; // Let the browser handle APIs natively (handled by our IndexedDB logic on failure)
  }
  // 2. Network-First Strategy for HTML pages
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // If the specific page isn't cached, return the root app shell
            return caches.match('/');
          });
        })
    );
    return;
  }
  // 3. Stale-While-Revalidate for CSS/JS/Images
  if (event.request.destination === 'style' || event.request.destination === 'script' || event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {
          console.warn('[SW] Asset fetch failed, serving from cache if available.');
        });
        
        return cachedResponse || fetchPromise;
      })
    );
  }
});
