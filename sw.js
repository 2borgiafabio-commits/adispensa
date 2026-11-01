// Funzionamento offline: i file dell'app vengono salvati sul telefono.
// Con la rete si scarica sempre la versione più nuova; senza rete si usa quella salvata.
const VERSION = 'adispensa-v3';
const SHELL = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/store.js',
  './js/seed.js',
  './js/config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Database Supabase: mai dalla cache
  if (url.hostname.endsWith('supabase.co')) return;

  // Librerie e icone dal CDN: dalla cache se ci sono
  if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      })),
    );
    return;
  }

  // File dell'app: prima la rete, poi la cache
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))),
    );
  }
});
