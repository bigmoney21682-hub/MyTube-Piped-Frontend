// File: src/pages/Watch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Player from "../components/Player";
import RelatedVideos from "../components/RelatedVideos";
import DebugOverlay from "../components/DebugOverlay";
import { API_KEY } from "../config";
import Spinner from "../components/Spinner";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
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
      {/* DEBUG OVERLAY */}
      <DebugOverlay />

      <Header />

      {loading && <Spinner message="Loading video…" />}

      {!loading && !video && (
        <div style={{ padding: 16 }}>
          <p>Video not found or unavailable.</p>
        </div>
      )}

      {!loading && video && (
        <>
          <h2>{snippet.title}</h2>
          <p style={{ opacity: 0.7 }}>by {snippet.channelTitle}</p>

          {/* Full-size Player (temporarily no mini player / draggable) */}
          {embedUrl && (
            <Player
              ref={playerRef}
              embedUrl={embedUrl}
              playing={true}
              onEnded={() => console.log("Video ended")}
            />
          )}

          {/* Related videos */}
          {video.id && <RelatedVideos videoId={video.id} apiKey={API_KEY} />}
        </>
      )}

      <Footer />
    </div>
  );
}
