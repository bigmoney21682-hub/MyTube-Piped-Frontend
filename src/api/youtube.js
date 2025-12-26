/**
 * File: youtube.js
 * Path: src/api/youtube.js
 * Description: YouTube API client with primary/fallback keys + quota tracking.
 */

import {
  recordCall,
  recordQuotaError,
  getQuotaSummary,
  getLastKeyUsed
} from "../debug/quotaTracker";

const PRIMARY = import.meta.env.VITE_YT_API_PRIMARY;
const FALLBACK1 = import.meta.env.VITE_YT_API_FALLBACK1;

const API_KEYS = [
  { key: PRIMARY, label: "PRIMARY" },
  { key: FALLBACK1, label: "FALLBACK1" }
];

function buildUrl(endpoint, params, key) {
  const query = new URLSearchParams({ key, ...params });
  return `https://www.googleapis.com/youtube/v3/${endpoint}?${query}`;
}

async function fetchWithFallback(endpoint, params) {
  for (const { key, label } of API_KEYS) {
    if (!key) continue;

    const url = buildUrl(endpoint, params, key);

    try {
      const res = await fetch(url);

      // Track quota usage
      recordCall(`${endpoint}.list`, label);

      // Log quota summary to console
      window.bootDebug?.info(getQuotaSummary());

      // Log request
      window.bootDebug?.info(`FETCH → ${url}`);

      if (res.ok) {
        window.bootDebug?.info(`FETCH OK ← ${url} (${res.status})`);
        return await res.json();
      }

      // Detect quotaExceeded
      if (res.status === 403) {
        recordQuotaError();
        window.bootDebug?.error("[QUOTA] quotaExceeded");
      }

      window.bootDebug?.error(`FETCH FAIL (${label})`, {
        url,
        status: res.status
      });
    } catch (err) {
      window.bootDebug?.error(`FETCH EXCEPTION (${label})`, { err });
    }
  }

  throw new Error("All YouTube API keys failed");
}

export async function getTrending(region = "US", maxResults = 25) {
  return fetchWithFallback("videos", {
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    maxResults,
    regionCode: region
  });
}

export async function searchVideos(query, maxResults = 25) {
  return fetchWithFallback("search", {
    part: "snippet",
    q: query,
    type: "video",
    maxResults
  });
}

export async function getVideoDetails(id) {
  return fetchWithFallback("videos", {
    part: "snippet,contentDetails,statistics",
    id
  });
}

export async function getRelatedVideos(id, maxResults = 25) {
  return fetchWithFallback("search", {
    part: "snippet",
    relatedToVideoId: id,
    type: "video",
    maxResults
  });
}
