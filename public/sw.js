/**
 * ------------------------------------------------------------
 * File: sw.js
 * Path: public/sw.js
 * Description:
 *   Service Worker for MyTubes PWA.
 *
 *   Goals:
 *     - Cache static assets (icons, manifest)
 *     - Cache index.html for offline shell
 *     - NEVER cache JS bundles aggressively (prevents stale builds)
 *     - Allow YouTube embeds without interference
 *     - Safe for GitHub Pages under /MyTubes/
 * ------------------------------------------------------------
 */

const CACHE_NAME = "mytubes-cache-v1";

// Only cache safe, static assets — NOT JS bundles
const STATIC_ASSETS = [
  "/MyTubes/",
  "/MyTubes/index.html",
  "/MyTubes/manifest.json",
  "/MyTubes/favicon.png",
  "/MyTubes/apple-touch-icon.png"
];

// ------------------------------------------------------------
// Install: pre-cache static assets
// ------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ------------------------------------------------------------
// Activate: clean old caches
// ------------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ------------------------------------------------------------
// Fetch handler
// ------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ------------------------------------------------------------
  // 1. Allow YouTube embeds to bypass SW completely
  // ------------------------------------------------------------
  if (
    url.hostname.includes("youtube.com") ||
    url.hostname.includes("googlevideo.com")
  ) {
    return; // Let network handle it
  }

  // ------------------------------------------------------------
  // 2. Never cache JS bundles (prevents stale builds)
  // ------------------------------------------------------------
  if (url.pathname.endsWith(".js")) {
    return; // Always fetch fresh
  }

  // ------------------------------------------------------------
  // 3. Cache-first for static assets
  // ------------------------------------------------------------
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
        );
      })
    );
    return;
  }

  // ------------------------------------------------------------
  // 4. Network-first for everything else
  // ------------------------------------------------------------
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
