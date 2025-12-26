// File: src/components/GlobalPlayer.jsx
// Fixed-position YouTube iframe player (YouTube-only architecture)

import React from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function GlobalPlayer() {
  const { currentVideo } = usePlayer();

  if (!currentVideo?.id) return null;

  return (
    <div
      id="yt-global-player"
      style={{
        position: "fixed",
        top: "var(--header-height)",      // sits under your header
        left: 0,
        width: "100%",
        height: "56.25vw",                // 16:9 responsive ratio
        maxHeight: "360px",               // optional cap for large screens
        background: "#000",
        zIndex: 99990,                    // above content, below DebugOverlay
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&playsinline=1&controls=1`}
        title="YouTube player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}
