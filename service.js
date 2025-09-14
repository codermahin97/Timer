const CACHE_NAME = "countdown-timer-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json"
];

self.addEventListener("install", event => {
  console.log("Service Worker: Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Service Worker: Caching files");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached file if found, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});
