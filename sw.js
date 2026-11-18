/**
 * CAS M.Tech CSE — Service Worker (sw.js)
 * Caches core HTML shells, tokens, components, scripts, and data for offline campus use.
 */

const CACHE_NAME = 'cas-mtech-cse-v2026.11';
const STATIC_ASSETS = [
  './',
  './index.html',
  './subject.html',
  './manifest.json',
  './data/courses.json',
  './assets/catalog.json',
  './assets/course-data.json',
  './assets/featured-guides.json',
  './assets/subject-topics.json',
  './assets/related-papers.json',
  './assets/styles.css',
  './assets/portal.css',
  './assets/mastery.css',
  './assets/css/tokens.css',
  './assets/css/components.css',
  './assets/css/print.css',
  './assets/js/study-docket.js',
  './assets/js/matchmaker.js',
  './assets/js/command-palette.js',
  './assets/js/theme.js',
  './assets/js/3d-hero.js',
  './assets/js/app.js',
  './assets/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Pre-cache warning (some non-critical assets skipped):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignore external links that shouldn't be cached
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback to cached index.html for navigation if offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
