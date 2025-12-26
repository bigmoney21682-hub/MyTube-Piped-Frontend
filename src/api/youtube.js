/**
 * File: youtube.js
 * Path: src/api/youtube.js
 * Description: YouTube Data API v3 client with primary + fallback API keys,
 * automatic retry chain, and DebugOverlay v3 logging.
 */

const PRIMARY = import.meta.env.VITE_YT_API_PRIMARY;
const FALLBACK1 = import.meta.env.VITE_YT_API_FALLBACK1;

const API_KEYS = [
  { key: PRIMARY, label: "PRIMARY" },
  { key: FALLBACK1, label: "FALLBACK1" }
];

/**
 * Build a YouTube API URL with a given key.
 */
function buildUrl(endpoint, params, key) {
  const query = new URLSearchParams({
    key,
    ...params
  });

  return `https://www.googleapis.com/youtube/v3/${endpoint}?${query.toString()}`;
}

/**
 * Fetch with automatic fallback across multiple API keys.
 */
async function fetchWithFallback(endpoint, params) {
  for (const { key, label } of API_KEYS) {
    if (!key) continue;

    const url = buildUrl(endpoint, params, key);

    try {
      const res = await fetch(url);

      // Log network attempt
      window.bootDebug?.info(`YouTube API request (${label}) → ${endpoint}`, {
        url
      });

      if (res.ok) {
        window.bootDebug?.info(`YouTube API success using ${label}`);
        return await res.json();
      }

      // Log failure
      window.bootDebug?.error(`YouTube API failed (${label})`, {
        url,
        status: res.status
      });
    } catch (err) {
      // Log exception
      window.bootDebug?.error(`YouTube API exception (${label})`, {
        endpoint,
        err
      });
    }
  }

  throw new Error("All YouTube API keys failed");
}

/**
 * Get trending videos.
 */
export async function getTrending(region = "US", maxResults = 25) {
  return fetchWithFallback("videos", {
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    maxResults,
    regionCode: region
  });
}

/**
 * Search videos.
 */
export async function searchVideos(query, maxResults = 25) {
  return fetchWithFallback("search", {
    part: "snippet",
    q: query,
    type: "video",
    maxResults
  });
}

/**
 * Get video details.
 */
export async function getVideoDetails(id) {
  return fetchWithFallback("videos", {
    part: "snippet,contentDetails,statistics",
    id
  });
}

/**
 * Get related videos.
 */
export async function getRelatedVideos(id, maxResults = 25) {
  return fetchWithFallback("search", {
    part: "snippet",
    relatedToVideoId: id,
    type: "video",
    maxResults
  });
}
