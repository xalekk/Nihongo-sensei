// sw.js — garde l'app disponible hors ligne.
// En ligne, on prend toujours la dernière version publiée. Hors ligne, ou si le réseau traîne, on prend la copie gardée.
// Si un nouveau fichier est ajouté à l'app, ajoute-le à cette liste et change le numéro de CACHE.
const CACHE = 'nihongo-sensei-v1';
const FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'assets/logo.svg',
  'assets/favicon-48.png',
  'assets/apple-touch-icon.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/icon-maskable-512.png',
  'js/langue.js',
  'js/donnees/kana.js',
  'js/donnees/prononciation.js',
  'js/donnees/karate.js',
  'js/donnees/etape01.js',
  'js/donnees/etape02.js',
  'js/donnees/etape03.js',
  'js/donnees/etape04.js',
  'js/donnees/etape05.js',
  'js/donnees/etape06.js',
  'js/donnees/etape07.js',
  'js/donnees/etape08.js',
  'js/donnees/etape09.js',
  'js/donnees/etape10.js',
  'js/donnees/etape11.js',
  'js/donnees/etape12.js',
  'js/donnees/etape13.js',
  'js/cours.js',
  'js/app.js',
];
const DELAI_RESEAU = 3000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

async function reseauDabord(req) {
  const cache = await caches.open(CACHE);
  const reseau = fetch(req, { cache: 'no-cache' }).then(r => {
    if (r.ok) cache.put(req, r.clone());
    return r;
  });
  const copie = (await cache.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? await cache.match('./') : undefined);
  if (!copie) return reseau;
  const delai = new Promise(ok => setTimeout(() => ok(copie), DELAI_RESEAU));
  return Promise.race([reseau.catch(() => copie), delai]);
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(reseauDabord(e.request));
});
