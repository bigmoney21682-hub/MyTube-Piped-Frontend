/**
 * File: Home.jsx
 * Path: src/pages/Home/Home.jsx
 * Description: Home page showing trending videos with API quota logging,
 *              DebugOverlay integration, and navigation to Watch page.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrendingVideos } from "../../api/youtube";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // Log mount
  useEffect(() => {
    window.bootDebug?.home("Home.jsx mounted");
  }, []);

  // Fetch trending videos
  useEffect(() => {
    window.bootDebug?.home("Fetching trending…");

    fetchTrendingVideos().then((items) => {
      setVideos(items);
      window.bootDebug?.home(`Trending loaded: ${items.length}`);
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Trending</h2>

      {videos.length === 0 && (
        <div style={{ opacity: 0.6 }}>No videos available</div>
      )}

      {videos.map((v) => (
        <div
          key={v.id}
          style={{
            display: "flex",
            marginBottom: "16px",
            cursor: "pointer"
          }}
          onClick={() => {
            window.bootDebug?.home(`Navigating to /watch/${v.id}`);
            navigate(`/watch/${v.id}`);
          }}
        >
          <img
            src={v.thumbnail}
            alt={v.title}
            style={{
              width: "160px",
              height: "90px",
              borderRadius: "6px",
              objectFit: "cover"
            }}
          />

          <div style={{ marginLeft: "12px", flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: 500 }}>
              {v.title}
            </div>

            <div style={{ opacity: 0.7, fontSize: "13px", marginTop: "4px" }}>
              {v.channel}
            </div>

            <div style={{ opacity: 0.5, fontSize: "12px", marginTop: "2px" }}>
              {Number(v.views).toLocaleString()} views
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
