// File: src/pages/Watch.jsx
// PCC v1.0 — Preservation-First Mode, full context verified

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RelatedVideos from "../components/RelatedVideos";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DebugOverlay from "../components/DebugOverlay";
import { API_KEY } from "../config";

// Temporarily disable ReactPlayer to isolate iOS PWA iframe issue
export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playerRef = useRef(null);

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

  // Setup playlist
  useEffect(() => {
    if (video) {
      setPlaylist([video]); // placeholder for multi-track support
      setCurrentIndex(0);
    }
  }, [video]);

  const currentTrack = playlist[currentIndex];
  const snippet = currentTrack?.snippet || {};
  const embedUrl = currentTrack?.id
    ? `https://www.youtube.com/embed/${currentTrack.id}?autoplay=1&controls=1&playsinline=1`
    : "";

  // PCC-Safe logging for iOS PWA debugging
  console.log("Watch.jsx debug: currentTrack", currentTrack);
  console.log("Watch.jsx debug: embedUrl", embedUrl);
  console.log("Watch.jsx debug: video object", video);

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
      <DebugOverlay />

      <Header />

      {loading && <Spinner message="Loading video…" />}

      {!loading && !currentTrack && (
        <div style={{ padding: 16 }}>
          <p>Video not found or unavailable.</p>
        </div>
      )}

      {!loading && currentTrack && (
        <>
          <h2>{snippet.title}</h2>
          <p style={{ opacity: 0.7 }}>by {snippet.channelTitle}</p>

          {/* PCC-SAFE TEMP: raw iframe for iOS PWA embed test */}
          {embedUrl && (
            <iframe
              title={snippet.title || "YouTube Test"}
              src={embedUrl}
              width="100%"
              height="300px"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none", marginTop: 16 }}
            />
          )}

          {currentTrack.id && (
            <RelatedVideos videoId={currentTrack.id} apiKey={API_KEY} />
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
