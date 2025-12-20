// File: src/pages/Home.jsx

import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Spinner";

/**
 * ⚡ Replace this with your actual YouTube Data API v3 key
 */
const YT_API_KEY = "YOUR_YOUTUBE_API_KEY_HERE";

/**
 * Safely extract YouTube video ID
 */
function extractVideoId(v) {
  if (!v) return null;
  if (typeof v.id === "string" && v.id.length > 5) return v.id;
  if (v.id && v.id.videoId) return v.id.videoId;
  if (typeof v.url === "string") {
    const match = v.url.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
  }
  return null;
}

/**
 * Build thumbnail URL
 */
function getThumbnail(v, id) {
  if (typeof v.thumbnail === "string" && v.thumbnail.length > 0) return v.thumbnail;
  if (v.snippet?.thumbnails?.high?.url) return v.snippet.thumbnails.high.url;
  if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return null;
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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(
          q.trim()
        )}&key=${YT_API_KEY}`
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

  useEffect(() => {
    (async () => {
      setLoadingTrending(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=25&key=${YT_API_KEY}`
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
        <Spinner message={loadingSearch ? "Searching…" : "Loading trending…"} />
      )}

      <Header onSearch={search} />

      {videos.length === 0 && !loadingTrending && list.length > 0 && (
        <h3 style={{ padding: "1rem", opacity: 0.8 }}>👀 Trending</h3>
      )}

      <div className="grid">
        {list.map((v, index) => {
          const id = extractVideoId(v);
          if (!id) return null;

          return (
            <VideoCard
              key={`${id}-${index}`}
              video={{
                id,
                title: v.snippet?.title || v.title || "Untitled",
                thumbnail: getThumbnail(v, id),
                author: v.snippet?.channelTitle || v.uploaderName || "Unknown",
                views: v.statistics?.viewCount || v.views,
                duration: v.contentDetails?.duration || null,
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
