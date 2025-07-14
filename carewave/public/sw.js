/* eslint-disable no-undef */
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

if (workbox) {
  console.log(`✅ Workbox is loaded`);

  workbox.core.setCacheNameDetails({
    prefix: 'hospital-management',
    suffix: 'v1',
    precache: {
      name: 'precache',
    },
    runtime: {
      name: 'runtime',
    },
  });

  // Precaching: cache everything built by Next.js
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Cache HTML pages with NetworkFirst
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
    })
  );

  // Cache CSS, JS, etc. with StaleWhileRevalidate
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // Cache images with CacheFirst
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

} else {
  console.log(`❌ Workbox didn't load`);
}