// File: src/utils/api.js
// PCC v3.0 — YouTube API wrapper using automatic fallback key rotation
// All requests use fetchWithFallback() to rotate between primary + fallback keys.

import { fetchWithFallback } from "./getApiKey";

const YT_BASE_URL = "https://www.googleapis.com/youtube/v3";
const MAX_RESULTS = 20;

/**
 * Search videos by query string
 * @param {string} query
 * @returns {Promise<Array>} video items
 */
export async function searchVideos(query) {
  if (!query) return [];

  const { data, keyUsed } = await fetchWithFallback(
    (key) =>
      `${YT_BASE_URL}/search?part=snippet&type=video&maxResults=${MAX_RESULTS}` +
      `&q=${encodeURIComponent(query)}&key=${key}`
  );

  window.debugLog?.(`searchVideos() used key: ${keyUsed}`);

  return data?.items || [];
}

/**
 * Fetch trending videos (US)
 */
export async function getTrending() {
  const { data, keyUsed } = await fetchWithFallback(
    (key) =>
      `${YT_BASE_URL}/videos?part=snippet,contentDetails,statistics` +
      `&chart=mostPopular&regionCode=US&maxResults=${MAX_RESULTS}&key=${key}`
  );

  window.debugLog?.(`getTrending() used key: ${keyUsed}`);

  return data?.items || [];
}

/**
 * Fetch related videos by video ID
 * @param {string} videoId
 */
export async function getRelated(videoId) {
  const { data, keyUsed } = await fetchWithFallback(
    (key) =>
      `${YT_BASE_URL}/search?part=snippet&type=video&maxResults=${MAX_RESULTS}` +
      `&relatedToVideoId=${videoId}&key=${key}`
  );

  window.debugLog?.(`getRelated() used key: ${keyUsed}`);

  return data?.items || [];
}
