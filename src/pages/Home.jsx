// File: src/pages/Home.jsx

import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Spinner";

// 🔐 YouTube Data API key (frontend for now)
const YT_API_KEY = import.meta.env.VITE_YT_API_KEY;

/**
 * Build thumbnail safely
 */
function getThumbnail(item) {
  return (
    item?.snippet?.thumbnails?.high?.url ||
    item?.snippet?.thumbnails?.medium?.url ||
    item?.snippet?.thumbnails?.default?.url ||
    null
  );
}

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(true);

  /* ================= SEARCH ================= */

  async function search(q) {
    if (!q.trim()) return;

    setLoadingSearch(true);
    setVideos([]);

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
          new URLSearchParams({
            part: "snippet",
            q: q.trim(),
            type: "video",
            maxResults: 25,
            key: YT_API_KEY,
          })
      );

      const data = await res.json();
      setVideos(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error("Search failed:", err);
      setVideos([]);
    } finally {
      setLoadingSearch(false);
    }
  }

  /* ================= TRENDING ================= */

  useEffect(() => {
    (async () => {
      setLoadingTrending(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?` +
            new URLSearchParams({
              part: "snippet,statistics,contentDetails",
              chart: "mostPopular",
              regionCode: "US",
              maxResults: 25,
              key: YT_API_KEY,
            })
        );

        const data = await res.json();
        setTrending(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error("Trending failed:", err);
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
        {list.map((item) => {
          const id =
            item.id?.videoId || item.id;

          if (!id) return null;

          return (
            <VideoCard
              key={id}
              video={{
                id,
                title: item.snippet?.title || "Untitled",
                thumbnail: getThumbnail(item),
                author: item.snippet?.channelTitle || "Unknown",
                views: item.statistics?.viewCount,
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
