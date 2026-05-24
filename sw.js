// Service Worker — Dapur Tamim POS
const CACHE_NAME = 'dt-pos-v2';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(['./', './index.html']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      if (r) return r;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const cl = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, cl));
        }
        return res;
      });
    }).catch(() => {
      if (e.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});