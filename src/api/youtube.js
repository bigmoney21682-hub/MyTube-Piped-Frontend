// File: src/api/youtube.js

const PRIMARY_KEY = import.meta.env.VITE_YT_API_PRIMARY;
const FALLBACK_KEY = import.meta.env.VITE_YT_API_FALLBACK1;

async function fetchWithKey(apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet,statistics,contentDetails` +
    `&chart=mostPopular` +
    `&regionCode=US` +
    `&maxResults=20` +
    `&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    // Surface YouTube error details in console for debugging
    console.error("YouTube API error:", res.status, data);
    throw new Error(`YouTube API error: ${res.status}`);
  }

  return data.items || [];
}

export async function fetchTrendingVideos() {
  try {
    // Try primary key first
    return await fetchWithKey(PRIMARY_KEY);
  } catch (e) {
    console.warn("Primary key failed, trying fallback...", e);
    // Then fallback
    return await fetchWithKey(FALLBACK_KEY);
  }
}
