// File: public/sw.js
// PCC v1.0 — Service Worker Terminator
// Purpose: Kill ALL old service workers and force Safari to reload fresh JS.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // Unregister this SW and ALL previous SWs
  self.registration.unregister().then(() => {
    // Reload all open tabs so they fetch fresh JS bundles
    return self.clients.matchAll();
  }).then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});
