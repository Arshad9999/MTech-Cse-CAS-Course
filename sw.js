/**
 * CAS M.Tech CSE — Service Worker (sw.js)
 * Network-First for HTML navigation so updates are immediately visible,
 * with resilient offline cache fallback.
 */

const CACHE_NAME = 'cas-mtech-cse-v2026.11.18-dl-rl-docs';
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
  './assets/course-visuals.json',
  './assets/course-reading.json',
  './assets/course-supplements.json',
  './assets/course-gfg.json',
  './assets/course-quizzes.json',
  './assets/docs/Deep-Learning-Master-Study-Notes.pdf',
  './assets/docs/Reinforcement-Learning-Complete-Study-Guide.pdf',
  './assets/styles.css',
  './assets/portal.css',
  './assets/mastery.css',
  './assets/css/tokens.css',
  './assets/css/components.css',
  './assets/css/print.css',
  './assets/js/theme.js',
  './assets/js/3d-hero.js',
  './assets/js/study-docket.js',
  './assets/js/matchmaker.js',
  './assets/js/command-palette.js',
  './assets/js/app.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Pre-cache warning (some non-critical assets skipped):', err);
      });
    })
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
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // For HTML navigation requests, use Network-First
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => cached || caches.match('./index.html'));
        })
    );
    return;
  }

  // For static assets, use Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
