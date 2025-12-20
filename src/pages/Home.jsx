// File: src/pages/Home.jsx

import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Spinner";
import { YOUTUBE_API_KEY } from "../config";

/**
 * Build thumbnail URL from video object
 */
function getThumbnail(video) {
  return video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url;
}

/**
 * Extract video ID
 */
function getVideoId(video) {
  if (!video) return null;
  return video.id?.videoId || video.id;
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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      setVideos(data.items || []);
    } catch (err) {
      console.error("Search failed:", err);
      setVideos([]);
    } finally {
      setLoadingSearch(false);
    }
  }

  useEffect(() => {
    async function fetchTrending() {
      setLoadingTrending(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=20&key=${YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        setTrending(data.items || []);
      } catch (err) {
        console.error("Trending fetch failed:", err);
        setTrending([]);
      } finally {
        setLoadingTrending(false);
      }
    }
    fetchTrending();
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
        {list.map((v, idx) => {
          const id = getVideoId(v);
          if (!id) return null;

          return (
            <VideoCard
              key={`${id}-${idx}`}
              video={{
                id,
                title: v.snippet?.title || "Untitled",
                thumbnail: getThumbnail(v),
                author: v.snippet?.channelTitle || "Unknown",
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
