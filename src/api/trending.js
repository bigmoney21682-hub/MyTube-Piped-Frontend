/**
 * File: trending.js
 * Path: src/api/trending.js
 * Description: Wrapper for YouTube trending videos using youtube.js API client.
 */

import { getTrending } from "./youtube";

export async function fetchTrendingVideos(region = "US", maxResults = 25) {
  try {
    const data = await getTrending(region, maxResults);

    // Normalize items (YouTube returns items array)
    return data?.items || [];
  } catch (err) {
    window.bootDebug?.error("Failed to load trending", err);
    return [];
  }
}
