// File: src/pages/Home.jsx
// PCC v13.3 — Trending feed + SearchBar + debug logs

import React, { useEffect, useState } from "react";
import { fetchTrendingVideos } from "../api/youtube";
import VideoCard from "../components/VideoCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      window.debugLog?.("Home: loading trending", "HOME");

      try {
        const items = await fetchTrendingVideos();
        setVideos(items);
        window.debugLog?.(`Trending loaded: ${items.length}`, "HOME");
      } catch {
        window.debugLog?.("Trending failed", "ERROR");
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <SearchBar />

      <div style={{ padding: 16 }}>
        <h2>Trending</h2>

        {loading && <p>Loading…</p>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
