// File: src/pages/Home.jsx
// PCC v6.1 — Unified Piped → Invidious → YouTube fallback + sourceUsed debug tag

import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import DebugOverlay from "../components/DebugOverlay";

export default function Home({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceUsed, setSourceUsed] = useState(null);

  const log = (msg) => window.debugLog?.(`Home: ${msg}`);

  const getId = (video) => {
    if (!video) return null;
    if (typeof video.id === "string") return video.id;
    if (typeof video.id?.videoId === "string") return video.id.videoId;
    return null;
  };

  const normalizeItem = (item) => {
    const vid = getId(item);
    if (!vid) return null;

    return {
      id: vid,
      title: item.title || item.snippet?.title,
      author: item.uploader || item.author || item.snippet?.channelTitle,
      thumbnail:
        item.thumbnail ||
        item.thumbnails?.medium?.url ||
        item.thumbnails?.default?.url,
      duration: item.duration || item.contentDetails?.duration,
    };
  };

  async function fetchFromPiped(path) {
    const url = `https://pipedapi.kavin.rocks${path}`;
    log(`DEBUG: Trying Piped: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      log(`DEBUG: Piped raw: ${raw.slice(0, 200)}...`);
      return JSON.parse(raw);
    } catch (err) {
      log(`ERROR: Piped failed: ${err}`);
      return null;
    }
  }

  async function fetchFromInvidious(path) {
    const url = `https://yewtu.be${path}`;
    log(`DEBUG: Trying Invidious: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      log(`DEBUG: Invidious raw: ${raw.slice(0, 200)}...`);
      return JSON.parse(raw);
    } catch (err) {
      log(`ERROR: Invidious failed: ${err}`);
      return null;
    }
  }

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

  useEffect(() => {
    async function load() {
      setLoading(true);
      let items = [];

      if (searchQuery && searchQuery.trim().length > 0) {
        const q = searchQuery.trim();
        log(`DEBUG: Searching for "${q}"`);

        const piped = await fetchFromPiped(
          `/search?q=${encodeURIComponent(q)}&filter=videos`
        );
        if (piped?.items?.length) {
          setSourceUsed("PIPED");
          items = piped.items;
        }

        if (!items.length) {
          const inv = await fetchFromInvidious(
            `/api/v1/search?q=${encodeURIComponent(q)}`
          );
          if (Array.isArray(inv) && inv.length) {
            setSourceUsed("INVIDIOUS");
            items = inv;
          }
        }

        if (!items.length) {
          setSourceUsed("YOUTUBE_API");
          items = await fetchFromYouTubeSearch(q);
        }

        log(`DEBUG: Search returned ${items.length} items`);
      } else {
        log("DEBUG: Fetching YouTube trending");

        const piped = await fetchFromPiped("/trending?region=US");
        if (Array.isArray(piped) && piped.length) {
          setSourceUsed("PIPED");
          items = piped;
        }

        if (!items.length) {
          const inv = await fetchFromInvidious("/api/v1/trending?region=US");
          if (Array.isArray(inv) && inv.length) {
            setSourceUsed("INVIDIOUS");
            items = inv;
          }
        }

        if (!items.length) {
          setSourceUsed("YOUTUBE_API");
          items = await fetchFromYouTubeTrending();
        }

        log(`DEBUG: Trending returned ${items.length} items`);
      }

      const normalized = items
        .map((item) => normalizeItem(item))
        .filter(Boolean);

      setVideos(normalized);
      setLoading(false);
    }

    load();
  }, [searchQuery]);

  if (loading)
    return (
      <>
        <DebugOverlay pageName="Home" sourceUsed={sourceUsed} />
        <p style={{ color: "#fff", padding: 16 }}>Loading…</p>
      </>
    );

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
