import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import DebugOverlay from "../components/DebugOverlay";
import { API_KEY } from "../config";

export default function Home({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const log = (msg) => window.debugLog?.(`Home: ${msg}`);

  // ---------------------------------------------------------
  // Trending + Search with 3‑Layer Fallback System
  // ---------------------------------------------------------
  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);

      // -----------------------------
      // 1) PIPED TRENDING
      // -----------------------------
      async function tryPipedTrending() {
        const url = "https://pipedapi.kavin.rocks/trending";
        log(`DEBUG: Trying Piped trending: ${url}`);

        try {
          const res = await fetch(url);
          const raw = await res.text();
          log(`DEBUG: Piped trending raw: ${raw}`);

          let data;
          try {
            data = JSON.parse(raw);
          } catch (err) {
            log(`DEBUG: Piped trending JSON parse error: ${err}`);
            return null;
          }

          if (!Array.isArray(data)) {
            log("DEBUG: Piped trending returned non-array");
            return null;
          }

          log(`DEBUG: Piped trending returned ${data.length} items`);

          return data.map((v) => ({
            id: v.id,
            snippet: {
              title: v.title,
              channelTitle: v.uploader,
              thumbnails: { high: { url: v.thumbnail } },
            },
            contentDetails: { duration: v.duration },
            statistics: { viewCount: v.views },
          }));
        } catch (err) {
          log(`DEBUG: Piped trending fetch exception: ${err}`);
          return null;
        }
      }

      // -----------------------------
      // 2) INVIDIOUS TRENDING
      // -----------------------------
      async function tryInvidiousTrending() {
        const url = "https://invidious.snopyta.org/api/v1/trending";
        log(`DEBUG: Trying Invidious trending: ${url}`);

        try {
          const res = await fetch(url);
          const raw = await res.text();
          log(`DEBUG: Invidious trending raw: ${raw}`);

          let data;
          try {
            data = JSON.parse(raw);
          } catch (err) {
            log(`DEBUG: Invidious trending JSON parse error: ${err}`);
            return null;
          }

          if (!Array.isArray(data)) {
            log("DEBUG: Invidious trending returned non-array");
            return null;
          }

          log(`DEBUG: Invidious trending returned ${data.length} items`);

          return data.map((v) => ({
            id: v.videoId,
            snippet: {
              title: v.title,
              channelTitle: v.author,
              thumbnails: { high: { url: v.videoThumbnails?.[2]?.url } },
            },
            contentDetails: { duration: v.lengthSeconds },
            statistics: { viewCount: v.viewCount },
          }));
        } catch (err) {
          log(`DEBUG: Invidious trending fetch exception: ${err}`);
          return null;
        }
      }

      // -----------------------------
      // 3) YOUTUBE TRENDING (Guaranteed)
      // -----------------------------
      async function tryYouTubeTrending() {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=30&regionCode=US&key=${API_KEY}`;
        log(`DEBUG: Trying YouTube trending: ${url}`);

        try {
          const res = await fetch(url);
          const raw = await res.text();
          log(`DEBUG: YouTube trending raw: ${raw}`);

          let data;
          try {
            data = JSON.parse(raw);
          } catch (err) {
            log(`DEBUG: YouTube trending JSON parse error: ${err}`);
            return null;
          }

          if (!data.items) {
            log("DEBUG: YouTube trending returned no items");
            return null;
          }

          log(`DEBUG: YouTube trending returned ${data.items.length} items`);
          return data.items;
        } catch (err) {
          log(`DEBUG: YouTube trending fetch exception: ${err}`);
          return null;
        }
      }

      // -----------------------------
      // SEARCH FALLBACKS
      // -----------------------------
      async function tryPipedSearch(query) {
        const url = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}`;
        log(`DEBUG: Trying Piped search: ${url}`);

        try {
          const res = await fetch(url);
          const raw = await res.text();
          log(`DEBUG: Piped search raw: ${raw}`);

          let data;
          try {
            data = JSON.parse(raw);
          } catch (err) {
            log(`DEBUG: Piped search JSON parse error: ${err}`);
            return null;
          }

          if (!Array.isArray(data.items)) {
            log("DEBUG: Piped search returned no items");
            return null;
          }

          log(`DEBUG: Piped search returned ${data.items.length} items`);

          return data.items.map((v) => ({
            id: v.id,
            snippet: {
              title: v.title,
              channelTitle: v.uploader,
              thumbnails: { high: { url: v.thumbnail } },
            },
          }));
        } catch (err) {
          log(`DEBUG: Piped search fetch exception: ${err}`);
          return null;
        }
      }

      async function tryYouTubeSearch(query) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=30&q=${encodeURIComponent(
          query
        )}&key=${API_KEY}`;

        log(`DEBUG: Trying YouTube search: ${url}`);

        try {
          const res = await fetch(url);
          const raw = await res.text();
          log(`DEBUG: YouTube search raw: ${raw}`);

          let data;
          try {
            data = JSON.parse(raw);
          } catch (err) {
            log(`DEBUG: YouTube search JSON parse error: ${err}`);
            return null;
          }

          if (!data.items) {
            log("DEBUG: YouTube search returned no items");
            return null;
          }

          log(`DEBUG: YouTube search returned ${data.items.length} items`);
          return data.items;
        } catch (err) {
          log(`DEBUG: YouTube search fetch exception: ${err}`);
          return null;
        }
      }

      // ---------------------------------------------------------
      // EXECUTION
      // ---------------------------------------------------------
      try {
        if (!searchQuery) {
          // TRENDING
          log("DEBUG: Fetching trending videos");

          let results = await tryPipedTrending();
          if (results) {
            log("DEBUG: Trending source = PIPED");
            setVideos(results);
            return;
          }

          results = await tryInvidiousTrending();
          if (results) {
            log("DEBUG: Trending source = INVIDIOUS");
            setVideos(results);
            return;
          }

          results = await tryYouTubeTrending();
          if (results) {
            log("DEBUG: Trending source = YOUTUBE");
            setVideos(results);
            return;
          }

          log("DEBUG: All trending fallbacks failed");
          setVideos([]);
        } else {
          // SEARCH
          log(`DEBUG: Fetching search results for: ${searchQuery}`);

          let results = await tryPipedSearch(searchQuery);
          if (results) {
            log("DEBUG: Search source = PIPED");
            setVideos(results);
            return;
          }

          results = await tryYouTubeSearch(searchQuery);
          if (results) {
            log("DEBUG: Search source = YOUTUBE");
            setVideos(results);
            return;
          }

          log("DEBUG: All search fallbacks failed");
          setVideos([]);
        }
      } catch (err) {
        log(`DEBUG: Home fetch error: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [searchQuery]);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
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
                v.snippet.thumbnails.medium?.url,
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
