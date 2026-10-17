const CACHE_NAME = "kimata-attendance-v2";

const FILES_TO_CACHE = [
  "./manifest.json",
  "./kimata-icon.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {

  // Always try to get the newest app page first
  if (event.request.mode === "navigate") {

    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match("./"))
    );

    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
