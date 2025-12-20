// File: src/pages/Watch.jsx

import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Watch() {
  const { id } = useParams();
  const playerRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    // Load YouTube IFrame API if not already present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // Called automatically by YouTube API
    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: id,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    };

    // If API already loaded
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [id]);

  return (
    <div style={{ padding: "1rem" }}>
      <div
        id="yt-player"
        style={{
          width: "100%",
          height: "70vh",
          backgroundColor: "#000",
          borderRadius: 12,
        }}
      />

      <p style={{ marginTop: "0.5rem", opacity: 0.6 }}>
        Video ID: {id}
      </p>
    </div>
  );
}
