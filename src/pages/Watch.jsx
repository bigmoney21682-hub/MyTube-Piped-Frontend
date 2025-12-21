// File: src/pages/Watch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import RelatedVideos from "../components/RelatedVideos";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Player from "../components/Player";
import DebugOverlay from "../components/DebugOverlay";
import { API_KEY } from "../config";

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
    console.log("DEBUG: Fetching video metadata for ID:", id);

    (async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${API_KEY}`
        );
        const data = await res.json();
        console.log("DEBUG: Video fetch response:", data);

        if (data.items?.length > 0) {
          setVideo(data.items[0]);
          console.log("DEBUG: Video set to state:", data.items[0]);
        } else {
          setVideo(null);
          console.warn("DEBUG: Video not found for ID:", id);
        }
      } catch (err) {
        console.error("DEBUG: Video fetch error:", err);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Setup playlist
  useEffect(() => {
    if (video) {
      setPlaylist([video]); // single video for now
      setCurrentIndex(0);
      console.log("DEBUG: Playlist initialized with video:", video);
    }
  }, [video]);

  const handleEnded = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      console.log("DEBUG: Moving to next video in playlist:", currentIndex + 1);
    } else {
      console.log("DEBUG: Playlist ended");
    }
  };

  const currentTrack = playlist[currentIndex];
  const snippet = currentTrack?.snippet || {};
  const embedUrl = currentTrack?.id
    ? `https://www.youtube.com/embed/${currentTrack.id}?autoplay=1&controls=1`
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
      {/* DEBUG overlay */}
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

          {embedUrl && (
            <>
              <div style={{ color: "#0f0", marginBottom: 8 }}>
                DEBUG: mounting Player with URL: {embedUrl}
              </div>
              <Player
                ref={playerRef}
                embedUrl={embedUrl}
                playing={true}
                onEnded={handleEnded}
                pipMode={false}  // Mini-player temporarily disabled
                draggable={false} // disable dragging
                trackTitle={snippet.title}
              />
            </>
          )}

          {currentTrack.id && (
            <>
              <div style={{ color: "#0f0", marginTop: 8 }}>
                DEBUG: mounting RelatedVideos
              </div>
              <RelatedVideos videoId={currentTrack.id} apiKey={API_KEY} />
            </>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
