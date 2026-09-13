/**
 * PassQ Production Service Worker v2.0
 * Stale-While-Revalidate + Cache-First Dynamic PWA Strategy
 */

const CACHE_NAME = 'passq-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/p.html',
  '/app.html',
  '/privacy.html',
  '/terms.html',
  '/imprint.html',
  '/cookies.html',
  '/compliance-statement.html',
  '/security.html',
  '/logo.svg',
  '/manifest.webmanifest'
];

// Pre-cache core app shells on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Purge obsolete caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Dynamic Runtime Caching Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept same-origin HTTP/HTTPS requests
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: Stale-While-Revalidate for Locales and HTML Pages
  if (url.pathname.startsWith('/locales/') || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse || caches.match(event.request) || caches.match('/index.html'));

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy 2: Cache-First for Immutable Assets (Hashed Vite JS/CSS, Images, Fonts)
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.png') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy 3: Network-First with Offline Cache Fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || caches.match('/index.html') || caches.match('/p.html');
      });
    })
  );
});
