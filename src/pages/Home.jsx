// File: src/pages/Home.jsx
// PCC v9.0 — YouTube API only + in-memory caching

import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import DebugOverlay from "../components/DebugOverlay";
import { getCached, setCached } from "../utils/youtubeCache";

export default function Home({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceUsed, setSourceUsed] = useState(null);

  const log = (msg) => window.debugLog?.(`Home: ${msg}`);

  // -------------------------------
  // Normalization helpers
  // -------------------------------
  const getId = (item) => {
    if (!item) return null;
    if (typeof item.id === "string") return item.id;
    if (typeof item.id?.videoId === "string") return item.id.videoId;
    return null;
  };

  const getThumbnail = (item) => {
    const t = item.snippet?.thumbnails;
    return (
      t?.maxres?.url ||
      t?.high?.url ||
      t?.medium?.url ||
      t?.default?.url ||
      null
    );
  };

  const normalizeItem = (item) => {
    const id = getId(item);
    if (!id) return null;

    return {
      id,
      title: item.snippet?.title || "Untitled",
      author: item.snippet?.channelTitle || "Unknown",
      thumbnail: getThumbnail(item),
      duration: item.contentDetails?.duration,
    };
  };

  // -------------------------------
  // YouTube API fetchers (with caching)
  // -------------------------------
  async function fetchFromYouTubeTrending() {
    const apiKey = window.YT_API_KEY;
    const cacheKey = "trending_US";

    const cached = getCached(cacheKey);
    if (cached) {
      log("DEBUG: Using cached trending");
      setSourceUsed("CACHE");
      return cached;
    }

    log("DEBUG: Fetching trending via YouTube API");

    try {
      const url =
        "https://www.googleapis.com/youtube/v3/videos" +
        `?part=snippet,contentDetails&chart=mostPopular&regionCode=US&maxResults=20&key=${apiKey}`;

      log(`DEBUG: Trending URL → ${url}`);

      const res = await fetch(url);
      const data = await res.json();

      if (!data.items || !Array.isArray(data.items)) {
        log("ERROR: YouTube trending returned no items or invalid format");
        log("RAW: " + JSON.stringify(data).slice(0, 300));
        return [];
      }

      setCached(cacheKey, data.items);
      setSourceUsed("YOUTUBE_API");
      return data.items;
    } catch (err) {
      log(`ERROR: YouTube trending failed: ${err}`);
      return [];
    }
  }

  async function fetchFromYouTubeSearch(query) {
    const apiKey = window.YT_API_KEY;
    const q = query.trim();
    const cacheKey = `search_${q.toLowerCase()}`;

    const cached = getCached(cacheKey);
    if (cached) {
      log(`DEBUG: Using cached search for "${q}"`);
      setSourceUsed("CACHE");
      return cached;
    }

    log(`DEBUG: Searching via YouTube API for "${q}"`);

    try {
      const url =
        "https://www.googleapis.com/youtube/v3/search" +
        `?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(
          q
        )}&key=${apiKey}`;

      log(`DEBUG: Search URL → ${url}`);

      const res = await fetch(url);
      const data = await res.json();

      if (!data.items || !Array.isArray(data.items)) {
        log("ERROR: YouTube search returned no items or invalid format");
        log("RAW: " + JSON.stringify(data).slice(0, 300));
        return [];
      }

      setCached(cacheKey, data.items);
      setSourceUsed("YOUTUBE_API");
      return data.items;
    } catch (err) {
      log(`ERROR: YouTube search failed: ${err}`);
      return [];
    }
  }

  // -------------------------------
  // Main loader
  // -------------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);
      setSourceUsed(null);
      setVideos([]);

      let items = [];

      if (searchQuery && searchQuery.trim().length > 0) {
        const q = searchQuery.trim();
        log(`DEBUG: Searching for "${q}"`);
        items = await fetchFromYouTubeSearch(q);
      } else {
        log("DEBUG: Fetching trending");
        items = await fetchFromYouTubeTrending();
      }

      log(`DEBUG: Raw items = ${items.length}`);

      const normalized = items.map(normalizeItem).filter(Boolean);
      log(`DEBUG: Normalized to ${normalized.length} videos`);

      setVideos(normalized);
      setLoading(false);
    }

    load();
  }, [searchQuery]);

  // -------------------------------
  // Render
  // -------------------------------
  if (loading) {
    return (
      <>
        <DebugOverlay pageName="Home" sourceUsed={sourceUsed} />
        <p style={{ color: "#fff", padding: 16 }}>Loading…</p>
      </>
    );
  }

  return (
    <>
      <DebugOverlay pageName="Home" sourceUsed={sourceUsed} />

      <div style={{ padding: 16 }}>
        {videos.length === 0 && (
          <p style={{ color: "#fff" }}>No results found.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </>
  );
}
