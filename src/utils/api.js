// File: src/utils/api.js

import { YT_API_KEY, YT_BASE_URL, MAX_RESULTS } from "../config";

/**
 * Search videos by query string
 * @param {string} query
 * @returns {Promise<Array>} video items
 */
export async function searchVideos(query) {
  if (!query) return [];

  const url = `${YT_BASE_URL}/search?part=snippet&type=video&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(
    query
  )}&key=${YT_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("API search error:", err);
    return [];
  }
}

/**
 * Fetch trending videos (US)
 */
export async function getTrending() {
  const url = `${YT_BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=${MAX_RESULTS}&key=${YT_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("API trending error:", err);
    return [];
  }
}

/**
 * Fetch related videos by video ID
 * @param {string} videoId
 */
export async function getRelated(videoId) {
  const url = `${YT_BASE_URL}/search?part=snippet&type=video&maxResults=${MAX_RESULTS}&relatedToVideoId=${videoId}&key=${YT_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("API related error:", err);
    return [];
  }
}
