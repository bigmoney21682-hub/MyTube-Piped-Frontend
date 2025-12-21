import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import DebugOverlay from "../components/DebugOverlay";
import { API_KEY } from "../config";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const log = (msg) => window.debugLog?.(msg);

  useEffect(() => {
    log("DEBUG: Home page mounted");

    (async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=10&regionCode=US&key=${API_KEY}`
        );
        const data = await res.json();
        setVideos(data.items || []);
        log(`DEBUG: Fetched popular videos: ${data.items?.length || 0}`);
      } catch (err) {
        log(`DEBUG: Home fetch error: ${err}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ paddingTop: "var(--header-height)", paddingBottom: "var(--footer-height)", minHeight: "100vh", background: "var(--app-bg)", color: "#fff" }}>
      <DebugOverlay pageName="Home" />

      <h2>Trending Videos</h2>
      {loading && <p>Loading videos…</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
        {videos.map((v) => (
          <VideoCard key={v.id} video={{
            id: v.id,
            title: v.snippet.title,
            thumbnail: v.snippet.thumbnails.medium.url,
            author: v.snippet.channelTitle
          }} />
        ))}
      </div>
    </div>
  );
}
