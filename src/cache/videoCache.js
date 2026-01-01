/**
 * File: videoCache.js
 * Path: src/cache/videoCache.js
 */

import { cacheGet, cacheSet } from "./apiCache.js";

export function getCachedVideo(id) {
  return cacheGet("video:" + id);
}

export function setCachedVideo(id, data) {
  cacheSet("video:" + id, data, 1000 * 60 * 10); // 10 min
}
