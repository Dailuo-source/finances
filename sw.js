// Keeps the app's own shell (icon, loading screen) on the phone so it opens instantly.
// Your budget itself always comes live from Google; nothing financial is stored here.
const CACHE = 'finances-shell-v4';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's own cache so the newest files are stored
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || e.request.method !== 'GET') return;
  // Network first so updates show up; fall back to the saved copy when offline.
  // cache: 'no-cache' makes the browser check GitHub for a newer version every time.
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
