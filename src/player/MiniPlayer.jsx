/**
 * File: MiniPlayer.jsx
 * Path: src/components/MiniPlayer.jsx
 * Description: Global mini‑player UI that controls the persistent GlobalPlayer.
 *              Appears when a video is playing AND user is not on /watch/:id.
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePlayer } from "../player/PlayerContext.jsx";
import { debugBus } from "../debug/debugBus.js";

export default function MiniPlayer() {
  // Safely extract values from PlayerContext
  const player = usePlayer() ?? {};

  const currentVideoId = player.currentVideoId ?? null;
  const isPlaying = player.isPlaying ?? false;
  const togglePlay = player.togglePlay ?? (() => {});

  const navigate = useNavigate();
  const location = useLocation();

  // Hide if no video OR on watch page
  if (!currentVideoId) return null;
  if (location.pathname.startsWith("/watch/")) return null;

  // Safe thumbnail
  const thumbnail = `https://i.ytimg.com/vi/${currentVideoId}/hqdefault.jpg`;

  function openFullPlayer() {
    debugBus.player("MiniPlayer → Navigate to /watch/" + currentVideoId);
    navigate(`/watch/${currentVideoId}`);
  }

  function handlePlayPause(e) {
    e.stopPropagation();
    togglePlay();
  }

  return (
    <div
      onClick={openFullPlayer}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "#111",
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderTop: "1px solid #333",
        cursor: "pointer",
        zIndex: 9999
      }}
    >
      <img
        src={thumbnail}
        alt="thumbnail"
        style={{
          width: "96px",
          height: "54px",
          objectFit: "cover",
          borderRadius: "4px",
          marginRight: "12px"
        }}
      />

      <div style={{ flex: 1, color: "#fff", fontSize: "14px" }}>
        {currentVideoId}
      </div>

      <button
        onClick={handlePlayPause}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "20px",
          border: "none",
          background: "#222",
          color: "#fff",
          fontSize: "18px",
          marginLeft: "12px"
        }}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
    </div>
  );
}
