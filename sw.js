/* مصروفي — Service Worker: يتيح العمل دون إنترنت بعد أول زيارة */
const VERSION = 'masroofi-v2.0.0';
const FONTS = 'masroofi-fonts-v1';
const CORE = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css', 'js/app.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// يعرض النسخة المخزّنة فوراً ويحدّثها في الخلفية
const swr = (req, cacheName) => caches.open(cacheName).then(async cache => {
  const hit = await cache.match(req, { ignoreSearch: true });
  const net = fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return hit || (await net) || Response.error();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(swr(req, FONTS));
  } else if (url.origin === location.origin) {
    e.respondWith(swr(req.mode === 'navigate' ? 'index.html' : req, VERSION));
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const open = list.find(c => 'focus' in c);
    return open ? open.focus() : self.clients.openWindow('./');
  }));
});
