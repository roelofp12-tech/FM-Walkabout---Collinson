// Collinson FM Suite — Service Worker
const CACHE = 'collinson-fm-v1';
const FILES = [
  './collinson-fm-suite_latest.html',
  './manifest.json'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  // Network first, fall back to cache
  e.respondWith(
    fetch(e.request).then(function(r){
      var clone = r.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
      return r;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
