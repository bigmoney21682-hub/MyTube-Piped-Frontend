// File: src/components/GlobalPlayer.jsx
// Fixed-position YouTube iframe player (YouTube-only, reduced overlays)

import React from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { debugPlayer, debugError } from "../utils/debug";

export default function GlobalPlayer() {
  const { currentVideo } = usePlayer();

  if (!currentVideo?.id) return null;

  const videoId = currentVideo.id;

  // Log that the player is active for this ID
  debugPlayer(`GlobalPlayer active for id=${videoId}`);

  // YouTube embed parameters tuned to minimize overlays/branding:
  // - autoplay=1         → auto-play when loaded
  // - playsinline=1      → no forced fullscreen on iOS
  // - controls=1         → keep normal controls
  // - modestbranding=1   → reduce large YouTube logo
  // - rel=0              → only related from same channel at end
  // - iv_load_policy=3   → hide annotations and cards
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=1&disablekb=0`;

  const handleIframeError = () => {
    debugError(`GlobalPlayer iframe failed to load for id=${videoId}`);
  };

  return (
    <div
      id="yt-global-player"
      style={{
        position: "fixed",
        top: "var(--header-height)",
        left: 0,
        width: "100%",
        height: "56.25vw", // 16:9
        maxHeight: "360px",
        background: "#000",
        zIndex: 99990, // above content, below DebugOverlay
      }}
    >
      <iframe
        src={src}
        title={`Playing: ${currentVideo.title || videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        onError={handleIframeError}
      />
    </div>
  );
}
