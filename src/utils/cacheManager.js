// File: src/utils/cacheManager.js
// DMPCC OFF, PCC v1.0 locked

export const CACHE_NAMES = {
  SERVICE_WORKER: "PWA Asset Cache (Service Worker)",
  RUNTIME: "Runtime Network Cache",
  VITE: "Dev Build Cache (Vite)",
};

// Clear service worker cache
export async function clearServiceWorkerCache() {
  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    for (const key of cacheKeys) {
      if (key !== "playlists-cache") { // playlists untouched
        await caches.delete(key);
        console.log(`[CacheManager] Cleared SW cache: ${key}`);
      }
    }
  }

  // Also unregister old SW if exists
  if (navigator.serviceWorker) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
      console.log("[CacheManager] Service Worker unregistered");
    }
  }
}

// Clear runtime cache (dynamic fetches)
export async function clearRuntimeCache() {
  if ("caches" in window) {
    const runtimeKeys = await caches.keys();
    for (const key of runtimeKeys) {
      if (key !== "playlists-cache") await caches.delete(key);
    }
    console.log("[CacheManager] Runtime caches cleared");
  }
}

// Clear Vite dev cache (dev only)
export function clearViteDevCache() {
  if (import.meta.env.DEV) {
    console.log("[CacheManager] Reloading to clear Vite dev cache...");
    window.location.reload();
  }
}

// Master clear function
export async function clearAllCaches() {
  await clearServiceWorkerCache();
  await clearRuntimeCache();
  clearViteDevCache();
}
