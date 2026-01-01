/**
 * File: apiCache.js
 * Path: src/cache/apiCache.js
 * Description: In-memory TTL cache with dev-safe behavior.
 */

const CACHE_VERSION = "v1"; // bump to invalidate all caches
const isDev = import.meta.env.DEV;

const store = new Map();

export function cacheGet(key) {
  if (isDev) return null; // disable cache in dev

  const entry = store.get(key);
  if (!entry) return null;

  const { time, ttl, value, version } = entry;

  if (version !== CACHE_VERSION) return null;
  if (Date.now() - time > ttl) return null;

  return value;
}

export function cacheSet(key, value, ttlMs = 1000 * 60 * 5) {
  if (isDev) return; // disable cache in dev

  store.set(key, {
    time: Date.now(),
    ttl: ttlMs,
    value,
    version: CACHE_VERSION
  });
}
