// File: src/pages/Watch.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RelatedVideos from "../components/RelatedVideos";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Player from "../components/Player";
import { API_KEY } from "../config";
import DebugOverlay from "../components/DebugOverlay";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // iOS autoplay-safe

  // Load video metadata
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${API_KEY}`
        );
        const data = await res.json();
        if (data.items?.length > 0) setVideo(data.items[0]);
        else setVideo(null);
      } catch (err) {
        console.error("Video fetch error:", err);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const snippet = video?.snippet || {};
  const embedUrl = video?.id
    ? `https://www.youtube.com/embed/${video.id}?autoplay=1&controls=1`
    : "";

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
      {/* Debug overlay */}
      <DebugOverlay />

      <Header />

      {loading && <p style={{ padding: 16 }}>Loading video…</p>}

      {!loading && !video && (
        <div style={{ padding: 16 }}>
          <p>Video not found or unavailable.</p>
        </div>
      )}

      {!loading && video && (
        <>
          <h2>{snippet.title}</h2>
          <p style={{ opacity: 0.7 }}>by {snippet.channelTitle}</p>

          {embedUrl && (
            <div style={{ position: "relative" }}>
              <Player
                ref={playerRef}
                embedUrl={embedUrl}
                playing={true}
                muted={isMuted} // <-- iOS-safe autoplay
              />
              {isMuted && (
                <button
                  onClick={() => setIsMuted(false)}
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    padding: "8px 12px",
                    background: "#ff4500",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Unmute
                </button>
              )}
            </div>
          )}

          {video.id && <RelatedVideos videoId={video.id} apiKey={API_KEY} />}
        </>
      )}

      <Footer />
    </div>
  );
}
