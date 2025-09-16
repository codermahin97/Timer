const URLS_TO_CACHE = ["/", "/index.html", "/style.css", "/script.js", "/manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// --- FIREBASE MESSAGING ---
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "BFNZsp3PiWbaQvP2XQwfYHiynk7HBQ4XOxMluctUvnU9sGFQkXy2-koC9PcAAkaRqlYtVjXymtFEO4t5_LPJ_-M",
  authDomain: "timer-3a89a.firebaseapp.com",
  projectId: "timer-3a89a",
  storageBucket: "timer-3a89a.appspot.com",
  messagingSenderId: "802459887711",
  appId: "1:802459887711:web:71898713e5cb92bc3393ea"
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "New Alert!";
  const notificationOptions = {
    body: payload.notification?.body || "Time's up!",
    icon: "/icon.png",
    badge: "/icon.png"
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// const CACHE_NAME = "countdown-timer-v1";
// const URLS_TO_CACHE = [
//   "/",
//   "/index.html",
//   "/style.css",
//   "/script.js",
//   "/manifest.json"
// ];
// self.addEventListener("install", event => {
//   console.log("Service Worker: Installed");

//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => {
//       console.log("Service Worker: Caching files");
//       return cache.addAll(URLS_TO_CACHE);
//     })
//   );
// });

// self.addEventListener("fetch", event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       // Return cached file if found, otherwise fetch from network
//       return response || fetch(event.request);
//     })
//   );
// });
// merged-service-worker.js

// --- CACHE STUFF ---
const CACHE_NAME = "countdown-timer-v1";