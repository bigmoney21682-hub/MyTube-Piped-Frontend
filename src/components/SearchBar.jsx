// File: src/pages/SearchResults.jsx
// PCC v1.0 — YouTube‑style search results with infinite scroll + skeletons

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);

  // ------------------------------------------------------------
  // Fetch search results
  // ------------------------------------------------------------
  async function fetchResults(pageToken = "") {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(
        query
      )}&key=${window.YT_API_KEY || ""}${pageToken ? `&pageToken=${pageToken}` : ""}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      const mapped = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        thumb: item.snippet.thumbnails.medium.url,
        published: item.snippet.publishedAt,
      }));

      if (pageToken) {
        setResults((prev) => [...prev, ...mapped]);
      } else {
        setResults(mapped);
      }

      setNextPage(data.nextPageToken || null);
      setError(null);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // ------------------------------------------------------------
  // Initial load
  // ------------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    setResults([]);
    fetchResults();
  }, [query]);

  // ------------------------------------------------------------
  // Infinite scroll observer
  // ------------------------------------------------------------
  useEffect(() => {
    if (!sentinelRef.current || !nextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          fetchResults(nextPage);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [nextPage, loadingMore]);

  // ------------------------------------------------------------
  // Skeleton loader
  // ------------------------------------------------------------
  const Skeleton = () => (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <div
        style={{
          width: 168,
          height: 94,
          background: "#222",
          borderRadius: 8,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ height: 16, background: "#222", marginBottom: 8 }} />
        <div style={{ height: 14, background: "#222", width: "60%" }} />
      </div>
    </div>
  );

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div style={{ padding: "16px 12px", color: "#fff" }}>
      <h2 style={{ marginBottom: 16 }}>Results for "{query}"</h2>

      {loading &&
        [...Array(8)].map((_, i) => <Skeleton key={i} />)}

      {error && (
        <div style={{ color: "red", marginTop: 20 }}>
          Error: {error}
          <button
            onClick={() => fetchResults()}
            style={{
              marginLeft: 12,
              padding: "6px 12px",
              background: "#ff0000",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading &&
        results.map((v) => (
          <Link
            key={v.id}
            to={`/watch/${v.id}`}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 20,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={v.thumb}
                alt=""
                style={{
                  width: 168,
                  height: 94,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{v.title}</div>
              <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>
                {v.channel}
              </div>
            </div>
          </Link>
        ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {loadingMore && (
        <div style={{ marginTop: 20 }}>
          <Skeleton />
          <Skeleton />
        </div>
      )}
    </div>
  );
}
