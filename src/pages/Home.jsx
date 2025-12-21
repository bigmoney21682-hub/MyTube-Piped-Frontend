// File: src/pages/Home.jsx

import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import DebugOverlay from "../components/DebugOverlay";
import { API_KEY } from "../config";

export default function Home({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const log = (msg) => window.debugLog?.(msg);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);

      try {
        if (!searchQuery) {
          // Load trending videos
          log("DEBUG: Fetching trending videos");

          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=30&regionCode=US&key=${API_KEY}`
          );

          const data = await res.json();
          setVideos(data.items || []);
          log(`DEBUG: Trending videos loaded: ${data.items?.length || 0}`);
        } else {
          // Load search results
          log(`DEBUG: Fetching search results for: ${searchQuery}`);

          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=30&q=${encodeURIComponent(
              searchQuery
            )}&key=${API_KEY}`
          );

          const data = await res.json();
          setVideos(data.items || []);
          log(`DEBUG: Search results loaded: ${data.items?.length || 0}`);
        }
      } catch (err) {
        log(`DEBUG: Home fetch error: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [searchQuery]);

  return (
    <div
      style={{
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--footer-height)",
        minHeight: "100vh",
        background: "var(--app-bg)",
        color: "#fff",
      }}
    >
      <DebugOverlay pageName="Home" />

      <h2 style={{ padding: "0 16px", marginBottom: "8px" }}>
        {searchQuery ? `Search Results for "${searchQuery}"` : "Trending Videos"}
      </h2>

      {loading && <p style={{ textAlign: "center" }}>Loading videos…</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
          padding: "0 8px",
        }}
      >
        {videos.map((v) => (
          <VideoCard
            key={v.id?.videoId || v.id}
            video={{
              id: v.id?.videoId || v.id,
              title: v.snippet.title,
              thumbnail:
                v.snippet.thumbnails.high?.url ||
                v.snippet.thumbnails.medium.url,
              author: v.snippet.channelTitle,
              duration: v.contentDetails?.duration,
              viewCount: v.statistics?.viewCount,
            }}
          />
        ))}
      </div>
    </div>
  );
}
