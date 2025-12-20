import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RelatedVideos from "../components/RelatedVideos";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Player from "../components/Player";
import { API_KEY } from "../config";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef(null);
  const overlayAudioRef = useRef(null);

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

  // Simulate a playlist (for testing continuous playback)
  useEffect(() => {
    if (video) {
      setPlaylist([video]); // Minimal starting playlist
      setCurrentIndex(0);
    }
  }, [video]);

  const handleEnded = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("Playlist ended");
    }
  };

  if (loading)
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
        <Header />
        <Spinner message="Loading video…" />
        <Footer />
      </div>
    );

  if (!video)
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
        <Header />
        <div style={{ padding: 16 }}>
          <p>Video not found or unavailable.</p>
        </div>
        <Footer />
      </div>
    );

  const { snippet } = video;

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
      <Header />

      <h2>{snippet.title}</h2>
      <p style={{ opacity: 0.7 }}>by {snippet.channelTitle}</p>

      {/* Hidden iframe for visual ad (muted) */}
      <iframe
        title={snippet.title}
        width="0"
        height="0"
        src={`https://www.youtube.com/embed/${id}?controls=0&autoplay=1&mute=1`}
        style={{ border: "none", display: "none" }}
      />

      {/* Overlay audio Player */}
      <Player
        ref={playerRef}
        src={`https://www.youtube.com/watch?v=${id}`}
        playing={true}
        onEnded={handleEnded}
        pipMode={true}
        overlayAudio={overlayAudioRef.current}
        trackTitle={snippet.title}
      />

      {/* Related videos */}
      <div style={{ marginTop: 32 }}>
        <h3>Related Videos</h3>
        <RelatedVideos videoId={id} apiKey={API_KEY} />
      </div>

      <Footer />
    </div>
  );
}
