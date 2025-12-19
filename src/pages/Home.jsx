// src/pages/Home.jsx

import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Spinner";
import { API_BASE } from "../config";

/**
 * Normalize thumbnail URLs coming from Piped.
 * - Removes /proxy/ prefixes
 * - Removes pipedproxy-*.kavin.rocks wrappers
 * - Falls back safely
 */
function normalizeThumbnail(url) {
  if (!url || typeof url !== "string") {
    return "/fallback.jpg";
  }

  // Case 1: /proxy/https://i.ytimg.com/...
  if (url.includes("/proxy/")) {
    const clean = url.split("/proxy/")[1];
    try {
      return decodeURIComponent(clean);
    } catch {
      return clean;
    }
  }

  // Case 2: https://pipedproxy-xx.kavin.rocks/https://i.ytimg.com/...
  if (url.includes("pipedproxy")) {
    const match = url.match(/(https:\/\/i\.ytimg\.com\/.+)$/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return url;
}

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(true);

  async function search(q) {
    if (!q.trim()) return;

    setLoadingSearch(true);
    setVideos([]);

    try {
      const res = await fetch(
        `${API_BASE}/search?q=${encodeURIComponent(q.trim())}&filter=videos`
      );
      const data = await res.json();
      setVideos(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error("❌ Search failed:", err);
      setVideos([]);
    } finally {
      setLoadingSearch(false);
    }
  }

  useEffect(() => {
    (async () => {
      setLoadingTrending(true);
      try {
        const res = await fetch(`${API_BASE}/trending?region=US`);
        const data = await res.json();
        setTrending(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Trending failed:", err);
        setTrending([]);
      } finally {
        setLoadingTrending(false);
      }
    })();
  }, []);

  const list = videos.length > 0 ? videos : trending;

  return (
    <div>
      {(loadingSearch || loadingTrending) && (
        <Spinner
          message={loadingSearch ? "Searching…" : "Loading trending…"}
        />
      )}

      <Header onSearch={search} />

      {videos.length === 0 && !loadingTrending && list.length > 0 && (
        <h3 style={{ padding: "1rem", opacity: 0.8 }}>👀 Trending</h3>
      )}

      <div className="grid">
        {list.map((v, index) => {
          const id =
            v.url?.includes("v=")
              ? v.url.split("v=")[1]
              : v.id || `video-${index}`;

          const rawThumb =
            v.thumbnail ||
            (Array.isArray(v.thumbnails) && v.thumbnails.length > 0
              ? v.thumbnails[v.thumbnails.length - 1].url
              : null);

          const finalThumb = normalizeThumbnail(rawThumb);

          // 🔍 DEBUG — remove once verified
          console.log("VIDEO RAW:", v);
          console.log("THUMB RAW:", rawThumb);
          console.log("THUMB FINAL:", finalThumb);

          return (
            <VideoCard
              key={id}
              video={{
                id,
                title: v.title || "Untitled",
                thumbnail: finalThumb,
                author: v.uploaderName || "Unknown",
                views: v.views,
                duration: v.duration > 0 ? v.duration : null,
              }}
            />
          );
        })}
      </div>

      {!loadingSearch && !loadingTrending && list.length === 0 && (
        <p style={{ textAlign: "center", padding: "3rem", opacity: 0.7 }}>
          No videos found.
        </p>
      )}
    </div>
  );
}
