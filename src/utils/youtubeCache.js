// File: src/utils/youtubeCache.js
// PCC v2.0 — YouTube API in-memory cache with rebuild marker + debug logging
// rebuild-cache-1

const cache = new Map();

/**
 * Retrieve a cached value by key.
 */
export function getCached(key) {
  const value = cache.get(key) || null;
  window.debugLog?.(`YouTubeCache: getCached("${key}") → ${value ? "HIT" : "MISS"}`);
  return value;
}

/**
 * Store a value in the cache.
 */
export function setCached(key, value) {
  window.debugLog?.(`YouTubeCache: setCached("${key}")`);
  cache.set(key, value);
}

/**
 * Clear all cached entries.
 */
export function clearYouTubeCache() {
  window.debugLog?.("YouTubeCache: clearYouTubeCache() → cache cleared");
  cache.clear();
}
