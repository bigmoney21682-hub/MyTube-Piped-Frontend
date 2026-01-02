/**
 * File: playlist.js
 * Path: src/api/playlist.js
 * Description: Fetches playlist items with dev-safe caching.
 */

import { youtubeApiRequest } from "./youtube.js";
import { cacheGet, cacheSet } from "../cache/apiCache.js";
import { debugBus } from "../debug/debugBus.js";
import { normalizeId } from "../utils/normalizeId.js";

export async function fetchPlaylistItems(playlistId, maxResults = 50) {
  if (!playlistId) return [];

  const key = `playlist:${playlistId}:${maxResults}`;

  const cached = cacheGet(key);
  if (cached) {
    debugBus.log("NETWORK", `PlaylistCache → HIT for ${playlistId}`);
    return cached;
  }

  debugBus.log("NETWORK", `PlaylistCache → MISS for ${playlistId}`);

  const data = await youtubeApiRequest("playlistItems", {
    part: "snippet,contentDetails",
    playlistId,
    maxResults: String(maxResults)
  });

  if (!Array.isArray(data?.items)) return [];

  const normalized = data.items
    .map((item) => {
      const id = normalizeId(item.contentDetails?.videoId || item);
      if (!id) {
        debugBus.warn("playlist.js → Skipped invalid playlist item:", item);
        return null;
      }

      return {
        id,
        title: item.snippet?.title,
        author: item.snippet?.channelTitle,
        channelId: item.snippet?.channelId,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        published: item.snippet?.publishedAt
      };
    })
    .filter(Boolean);

  cacheSet(key, normalized, 1000 * 60 * 10); // 10 min

  return normalized;
}
