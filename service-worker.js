// Fyhno Fight — service worker
// Bump CACHE_VERSION any time shipped assets change. The two-reload pattern from Soar:
// first reload installs the new SW, second reload serves the new files.
const CACHE_VERSION = 'fyhno-fight-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './src/main.js',
  // Asset paths are added here as the game grows.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
