// File: src/pages/Home.jsx
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Spinner";
import { API_KEY } from "../config";
import DebugOverlay from "../components/DebugOverlay";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const log = (msg) => window.debugLog?.(msg);

  async function search(q) {
    if (!q.trim()) return;
    setLoadingSearch(true);
    setVideos([]);
    log(`DEBUG: Searching videos for query: "${q}"`);

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(
          q.trim()
        )}&key=${API_KEY}`
      );
      const data = await res.json();
      setVideos(Array.isArray(data.items) ? data.items : []);
      log(`DEBUG: Search returned ${data.items?.length || 0} items`);
    } catch (err) {
      setVideos([]);
      log(`DEBUG: Search error: ${err}`);
    } finally {
      setLoadingSearch(false);
    }
  }

  useEffect(() => {
    (async () => {
      setLoadingTrending(true);
      log("DEBUG: Fetching trending videos");

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=US&key=${API_KEY}`
        );
        const data = await res.json();
        setTrending(Array.isArray(data.items) ? data.items : []);
        log(`DEBUG: Trending returned ${data.items?.length || 0} items`);
      } catch (err) {
        setTrending([]);
        log(`DEBUG: Trending fetch error: ${err}`);
      } finally {
        setLoadingTrending(false);
      }
    })();
  }, []);

  const list = videos.length > 0 ? videos : trending;

  return (
    <div>
      <DebugOverlay />

      {(loadingSearch || loadingTrending) && (
        <Spinner message={loadingSearch ? "Searching…" : "Loading trending…"} />
      )}

      <Header onSearch={search} />

      {videos.length === 0 && !loadingTrending && list.length > 0 && (
        <h3 style={{ padding: "1rem", opacity: 0.8 }}>👀 Trending</h3>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {list.map((v, index) => {
          const id = v.id?.videoId || (typeof v.id === "string" ? v.id : null);
          if (!id) return null;

          return (
            <VideoCard
              key={`${id}-${index}`}
              video={{
                id,
                title: v.snippet?.title || "Untitled",
                thumbnail:
                  v.snippet?.thumbnails?.high?.url ||
                  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                author: v.snippet?.channelTitle || "Unknown",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
