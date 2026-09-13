/**
 * PassQ Production Service Worker v4.0
 * Network-First for Documents & HTML (Ensures CSS/JS hash sync) + Cache-First for static assets
 */

const CACHE_NAME = 'passq-v5-clean';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Purge all obsolete caches immediately on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Dynamic Runtime Fetch Handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept GET HTTP/HTTPS requests
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation / HTML pages / Locales: Network-First with Cache Fallback
  if (
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.includes('/locales/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, Fonts, Images): Network-First for fresh hash, Fallback to Cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
