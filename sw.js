const cacheName = "cachev1";
const urls = [
    "/style/style.css",
    "/style/style.css.map",
    "/js/build.js",
    "/manifest.webmanifest",
    "favicon.ico",
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap",
    "/assets/home.svg",
    "/assets/activity.svg",
    "/assets/add.svg",
    "/assets/hamburger.svg",
    "/assets/x.svg",
    "/assets/nav-image.svg",
    "/assets/reload-icon.svg",
    "/assets/logo.svg",
    "/assets/logo.png",
    "/assets/pwa/512icon.png",
    "/assets/pwa/1024icon.png",
    "/assets/pwa/190icon.png",
    "/index.html",
    "/",
];
self.addEventListener("install", (ev) => {
    ev.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            return cache.addAll(urls);
        })
    );
});

self.addEventListener("fetch", (ev) => {
    ev.respondWith(
        caches.match(ev.request)
        .then((res) => {
            if (res) {
                return res;
            }
            return fetch(ev.request);
        })
    );
});