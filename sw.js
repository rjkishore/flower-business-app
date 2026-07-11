// Service Worker - Always fetch fresh from network
const CACHE = 'flower-app-v9';

self.addEventListener('install', e => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', e => {
  // Delete ALL old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Firebase calls - always network
  if (e.request.url.includes('firebaseio.com') || 
      e.request.url.includes('gstatic.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // App files - Network first, NO caching
  // This means every refresh gets the latest version
  e.respondWith(
    fetch(e.request).catch(() => {
      // Only use cache if completely offline
      return caches.match(e.request);
    })
  );
});
