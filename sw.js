// KILL SWITCH — this service worker exists only to remove itself and any
// caches left behind by earlier versions. It registers no fetch handler, so
// every request goes straight to the network.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // 1. Delete every cache this origin ever created.
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));

    // 2. Take control of any open pages.
    await self.clients.claim();

    // 3. Unregister this service worker for good.
    await self.registration.unregister();

    // 4. Force every open tab to reload from the network.
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});
