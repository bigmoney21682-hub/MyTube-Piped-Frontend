// File: src/api/youtube.js
// PCC v13.5 — Unified YouTube-only API layer with rich debug

const PRIMARY_KEY = import.meta.env.VITE_YT_API_PRIMARY;
const FALLBACK_KEY = import.meta.env.VITE_YT_API_FALLBACK1;

async function fetchJSON(url, apiKey) {
  // Log which endpoint + key are used
  window.debugApi?.(url, apiKey);

  const res = await fetch(`${url}&key=${apiKey}`);
  let data = null;

  try {
    data = await res.json();
  } catch (e) {
    window.debugLog?.("Failed to parse JSON from YouTube", "ERROR");
    throw new Error("Invalid JSON from YouTube");
  }

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      `YouTube API error: ${res.status}`;

    window.debugLog?.(`API ERROR ${res.status}: ${msg}`, "ERROR");
    throw new Error(msg);
  }

  return data;
}

async function tryKeys(url) {
  try {
    return await fetchJSON(url, PRIMARY_KEY);
  } catch (e) {
    window.debugLog?.(
      `Primary key failed: ${e.message || e}`,
      "ERROR"
    );
    return await fetchJSON(url, FALLBACK_KEY);
  }
}

function normalize(item) {
  return {
    id: item.id?.videoId || item.id || item.videoId || null,
    title: item.snippet?.title || "Untitled",
    channelTitle: item.snippet?.channelTitle || "Unknown Channel",
    thumbnail:
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.high?.url ||
      null,
  };
}

// Trending
export async function fetchTrendingVideos() {
  window.debugLog?.("Fetching trending videos", "HOME");

  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    "?part=snippet,statistics,contentDetails" +
    "&chart=mostPopular" +
    "&regionCode=US" +
    "&maxResults=20";

  const data = await tryKeys(url);
  const items = (data.items || []).map(normalize);

  window.debugLog?.(
    `Trending loaded: ${items.length} items`,
    "HOME"
  );

  return items;
}

// Video details
export async function fetchVideoDetails(id) {
  window.debugLog?.(`Fetch details ${id}`, "WATCH");

  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    "?part=snippet,statistics,contentDetails" +
    `&id=${id}`;

  const data = await tryKeys(url);
  const item = data.items?.[0];

  if (!item) {
    window.debugLog?.("No details returned for video", "ERROR");
    return null;
  }

  return normalize(item);
}

// Related
export async function fetchRelatedVideos(id) {
  window.debugLog?.(`Fetch related for ${id}`, "PLAYER");

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet&type=video&maxResults=20" +
    `&relatedToVideoId=${id}`;

  const data = await tryKeys(url);
  const items = (data.items || []).map(normalize);

  window.debugLog?.(
    `Related loaded: ${items.length} items`,
    "PLAYER"
  );

  return items;
}

// Search
export async function fetchSearchResults(query) {
  window.debugLog?.(`Search query: ${query}`, "SEARCH");

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet&type=video&maxResults=20" +
    `&q=${encodeURIComponent(query)}`;

  const data = await tryKeys(url);
  const items = (data.items || []).map(normalize);

  window.debugLog?.(
    `Search results: ${items.length} items`,
    "SEARCH"
  );

  return items;
}
