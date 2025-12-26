// File: src/api/youtube.js
// PCC v13.2 — Unified YouTube-only API layer
// - Trending videos
// - Video details
// - Related videos
// - Search results
// - Unified output shape for all components

const PRIMARY_KEY = import.meta.env.VITE_YT_API_PRIMARY;
const FALLBACK_KEY = import.meta.env.VITE_YT_API_FALLBACK1;

// ------------------------------------------------------------
// Helper: fetch with a specific key
// ------------------------------------------------------------
async function fetchJSON(url, apiKey) {
  const res = await fetch(`${url}&key=${apiKey}`);
  const data = await res.json();

  if (!res.ok) {
    console.error("YouTube API error:", res.status, data);
    throw new Error(`YouTube API error: ${res.status}`);
  }

  return data;
}

// ------------------------------------------------------------
// Helper: try primary → fallback
// ------------------------------------------------------------
async function tryKeys(url) {
  try {
    return await fetchJSON(url, PRIMARY_KEY);
  } catch (e) {
    console.warn("Primary key failed, trying fallback...", e);
    return await fetchJSON(url, FALLBACK_KEY);
  }
}

// ------------------------------------------------------------
// Normalize YouTube API item → unified shape
// ------------------------------------------------------------
function normalize(item) {
  return {
    id:
      item.id?.videoId ||
      item.id ||
      item.videoId ||
      null,

    title: item.snippet?.title || "Untitled",
    channelTitle: item.snippet?.channelTitle || "Unknown Channel",

    thumbnail:
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.high?.url ||
      null,
  };
}

// ------------------------------------------------------------
// 1. Trending videos
// ------------------------------------------------------------
export async function fetchTrendingVideos() {
  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    "?part=snippet,statistics,contentDetails" +
    "&chart=mostPopular" +
    "&regionCode=US" +
    "&maxResults=20";

  const data = await tryKeys(url);
  return (data.items || []).map(normalize);
}

// ------------------------------------------------------------
// 2. Video details
// ------------------------------------------------------------
export async function fetchVideoDetails(id) {
  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    "?part=snippet,statistics,contentDetails" +
    `&id=${id}`;

  const data = await tryKeys(url);
  const item = data.items?.[0];

  return item ? normalize(item) : null;
}

// ------------------------------------------------------------
// 3. Related videos
// ------------------------------------------------------------
export async function fetchRelatedVideos(id) {
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet" +
    "&type=video" +
    "&maxResults=20" +
    `&relatedToVideoId=${id}`;

  const data = await tryKeys(url);
  return (data.items || []).map(normalize);
}

// ------------------------------------------------------------
// 4. Search results
// ------------------------------------------------------------
export async function fetchSearchResults(query) {
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet" +
    "&type=video" +
    "&maxResults=20" +
    `&q=${encodeURIComponent(query)}`;

  const data = await tryKeys(url);
  return (data.items || []).map(normalize);
}
