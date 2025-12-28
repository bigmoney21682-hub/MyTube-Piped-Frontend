/**
 * File: trending.js
 * Path: src/api/trending.js
 * Description: Fetches trending videos using YouTube Data API v3 through
 *              the unified youtubeApiRequest client.
 */

import { youtubeApiRequest } from "./youtube.js";
import { debugBus } from "../debug/debugBus.js";

/**
 * Fetch trending videos for a region.
 *
 * @param {string} region - ISO 3166-1 alpha-2 region code (e.g. "US")
 * @returns {Promise<Array>} - normalized video list
 */
export async function fetchTrendingVideos(region = "US") {
  debugBus.log("NETWORK", `Trending → Fetching for region=${region}`);

  const data = await youtubeApiRequest("videos", {
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    regionCode: region,
    maxResults: "25"
  });

  if (!data || !Array.isArray(data.items)) {
    debugBus.log("NETWORK", "Trending → No data returned from YouTube");
    return [];
  }

  const normalized = data.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    author: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    thumbnail: item.snippet.thumbnails?.medium?.url,
    views: item.statistics?.viewCount,
    published: item.snippet.publishedAt
  }));

  debugBus.log(
    "NETWORK",
    `Trending → Normalized ${normalized.length} videos`
  );

  return normalized;
}
