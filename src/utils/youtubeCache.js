// File: src/utils/youtubeCache.js
// PCC v1.0 — Simple in-memory cache for YouTube API responses

const cache = new Map();

/**
 * Retrieve a cached value by key.
 */
export function getCached(key) {
  return cache.get(key) || null;
}

/**
 * Store a value in the cache.
 */
export function setCached(key, value) {
  cache.set(key, value);
}

/**
 * Clear all cached entries.
 */
export function clearYouTubeCache() {
  cache.clear();
}
