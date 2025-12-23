// File: src/pages/Home.jsx
// PCC v7.0 — Invidious primary, YouTube fallback, fixed thumbnails, sourceUsed debug

import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import DebugOverlay from "../components/DebugOverlay";

const INVIDIOUS_BASE = "https://yewtu.be";

export default function Home({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceUsed, setSourceUsed] = useState(null);

  const log = (msg) => window.debugLog?.(`Home: ${msg}`);

  // -------------------------------
  // ID extraction
  // -------------------------------
  const getId = (item) => {
    if (!item) return null;

    // Invidious search/trending: videoId
    if (typeof item.videoId === "string") return item.videoId;

    // YouTube trending: id is string
    if (typeof item.id === "string") return item.id;

    // YouTube search: id.videoId
    if (typeof item.id?.videoId === "string") return item.id.videoId;

    return null;
  };

  // -------------------------------
  // Thumbnail selection
  // -------------------------------
  const getThumbnail = (item) => {
    if (!item) return null;

    // Invidious: videoThumbnails array with .url
    if (Array.isArray(item.videoThumbnails) && item.videoThumbnails.length > 0) {
      const best = item.videoThumbnails[item.videoThumbnails.length - 1];
      if (best?.url) {
        if (best.url.startsWith("http")) return best.url;
        return `${INVIDIOUS_BASE}${best.url}`;
      }
    }

    // Invidious: single thumbnail string, often relative
    if (typeof item.thumbnail === "string") {
      if (item.thumbnail.startsWith("http")) return item.thumbnail;
      if (item.thumbnail.startsWith("/")) return `${INVIDIOUS_BASE}${item.thumbnail}`;
      return item.thumbnail;
    }

    // YouTube: snippet.thumbnails
    const thumbs = item.snippet?.thumbnails;
    if (thumbs?.medium?.url) return thumbs.medium.url;
    if (thumbs?.high?.url) return thumbs.high.url;
    if (thumbs?.default?.url) return thumbs.default.url;

    return null;
  };

  // -------------------------------
  // Normalization
  // -------------------------------
  const normalizeItem = (item) => {
    const id = getId(item);
    if (!id) return null;

    return {
      id,
      title: item.title || item.snippet?.title || "Untitled",
      author:
        item.author ||
        item.uploader ||
        item.snippet?.channelTitle ||
        "Unknown",
      thumbnail: getThumbnail(item),
      duration: item.duration || item.lengthSeconds || item.contentDetails?.duration,
    };
  };

  // -------------------------------
  // Invidious fetchers
  // -------------------------------
  async function fetchFromInvidiousTrending() {
    const url = `${INVIDIOUS_BASE}/api/v1/trending?region=US`;
    log(`DEBUG: Trying Invidious trending: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      log(`ERROR: Invidious trending failed: ${err}`);
      return [];
    }
  }

  async function fetchFromInvidiousSearch(query) {
    const url = `${INVIDIOUS_BASE}/api/v1/search?q=${encodeURIComponent(
      query
    )}&type=video`;
    log(`DEBUG: Trying Invidious search: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      log(`ERROR: Invidious search failed: ${err}`);
      return [];
    }
  }

  // -------------------------------
  // YouTube fallback
  // -------------------------------
  async function fetchFromYouTubeTrending() {
    log("DEBUG: Trending fallback → YouTube API");

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&regionCode=US&maxResults=20&key=${window.YT_API_KEY}`
      );
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      log(`ERROR: YouTube trending failed: ${err}`);
      return [];
    }
  }

  async function fetchFromYouTubeSearch(query) {
    log("DEBUG: Search fallback → YouTube API");

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(
          query
        )}&key=${window.YT_API_KEY}`
      );
      const data = await res.json();
      return data.items || [];
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

      let items = [];

      // SEARCH MODE
      if (searchQuery && searchQuery.trim().length > 0) {
        const q = searchQuery.trim();
        log(`DEBUG: Searching for "${q}"`);

        const inv = await fetchFromInvidiousSearch(q);
        if (inv.length) {
          setSourceUsed("INVIDIOUS");
          items = inv;
        }

        if (!items.length) {
          const yt = await fetchFromYouTubeSearch(q);
          if (yt.length) {
            setSourceUsed("YOUTUBE_API");
            items = yt;
          }
        }

        log(`DEBUG: Search returned ${items.length} items`);
      }

      // TRENDING MODE
      else {
        log("DEBUG: Fetching trending");

        const inv = await fetchFromInvidiousTrending();
        if (inv.length) {
          setSourceUsed("INVIDIOUS");
          items = inv;
        }

        if (!items.length) {
          const yt = await fetchFromYouTubeTrending();
          if (yt.length) {
            setSourceUsed("YOUTUBE_API");
            items = yt;
          }
        }

        log(`DEBUG: Trending returned ${items.length} items`);
      }

      const normalized = items.map(normalizeItem).filter(Boolean);
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
