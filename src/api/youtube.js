// File: src/api/youtube.js
// PCC v13.3 — Unified YouTube-only API layer

const PRIMARY_KEY = import.meta.env.VITE_YT_API_PRIMARY;
const FALLBACK_KEY = import.meta.env.VITE_YT_API_FALLBACK1;

async function fetchJSON(url, apiKey) {
  window.debugApi?.(url, apiKey);

  const res = await fetch(`${url}&key=${apiKey}`);
  const data = await res.json();

  if (!res.ok) {
    window.debugLog?.(`API ERROR ${res.status}`, "API");
    throw new Error(`YouTube API error: ${res.status}`);
  }

  return data;
}

async function tryKeys(url) {
  try {
    return await fetchJSON(url, PRIMARY_KEY);
  } catch {
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

export async function fetchTrendingVideos() {
  window.debugLog?.("Fetching trending videos", "HOME");

  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    "?part=snippet,statistics,contentDetails" +
    "&chart=mostPopular" +
    "&regionCode=US" +
    "&maxResults=20";

  const data = await tryKeys(url);
  return (data.items || []).map(normalize);
}

export async function fetchVideoDetails(id) {
  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    "?part=snippet,statistics,contentDetails" +
    `&id=${id}`;

  const data = await tryKeys(url);
  return data.items?.[0] ? normalize(data.items[0]) : null;
}

export async function fetchRelatedVideos(id) {
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet&type=video&maxResults=20" +
    `&relatedToVideoId=${id}`;

  const data = await tryKeys(url);
  return (data.items || []).map(normalize);
}

export async function fetchSearchResults(query) {
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet&type=video&maxResults=20" +
    `&q=${encodeURIComponent(query)}`;

  const data = await tryKeys(url);
  return (data.items || []).map(normalize);
}
