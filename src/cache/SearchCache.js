/**
 * File: SearchCache.js
 * Path: src/cache/SearchCache.js
 * Description: Smart search cache with TTL + reuse counter.
 *              Now fully ID-normalized to prevent invalid video IDs.
 */

import { normalizeId } from "../utils/normalizeId.js";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REUSE = 20;               // reuse cached result 20 times

// In-memory cache (fastest, safest for dev)
const searchCache = {};

/**
 * Stores search results with metadata.
 * Ensures all items are normalized BEFORE caching.
 */
export function setSearchCache(query, results) {
  const normalized = results
    .map((item) => {
      const id = normalizeId(item);
      if (!id) return null;
      return { ...item, id };
    })
    .filter(Boolean);

  searchCache[query] = {
    results: normalized,
    ts: Date.now(),
    reuse: 0
  };
}

/**
 * Retrieves cached results if still valid.
 */
export function getSearchCache(query) {
  const entry = searchCache[query];
  if (!entry) return null;

  const age = Date.now() - entry.ts;

  // TTL expired → invalidate
  if (age > CACHE_TTL_MS) {
    delete searchCache[query];
    return null;
  }

  // Reuse limit reached → invalidate
  if (entry.reuse >= MAX_REUSE) {
    delete searchCache[query];
    return null;
  }

  // Valid → increment reuse counter
  entry.reuse += 1;

  return entry.results;
}

/**
 * Clears a specific query from cache.
 */
export function clearSearchCache(query) {
  delete searchCache[query];
}

/**
 * Clears all search cache.
 */
export function clearAllSearchCache() {
  Object.keys(searchCache).forEach((k) => delete searchCache[k]);
}
