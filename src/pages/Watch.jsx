// File: src/pages/Watch.jsx

import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Spinner from "../components/Spinner";

export default function Watch() {
  const { id } = useParams();
  const playerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Load YouTube IFrame API once
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // Create player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: id,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          fs: 1,
        },
        events: {
          onReady: () => {
            setLoading(false);
          },
        },
      });
    };

    // Cleanup on unmount
    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [id]);

  return (
    <div style={{ padding: "1rem" }}>
      {loading && <Spinner message="Loading audio…" />}

      {/* Player container */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: "#000",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div id="yt-player" />
      </div>

      <p style={{ marginTop: "0.75rem", opacity: 0.6 }}>
        Video ID: {id}
      </p>
    </div>
  );
}
