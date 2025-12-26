// File: src/components/MiniPlayer.jsx
// PCC v1.0 — Minimalist Premium MiniPlayer

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";

export default function MiniPlayer() {
  const navigate = useNavigate();
  const { currentVideo, playerMetrics, pause, play, stop } = usePlayer();

  // Hidden when nothing is playing
  if (!currentVideo) return null;

  const isPlaying = playerMetrics.state === "playing";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom) + 0px)",
        left: 0,
        right: 0,
        height: 64,
        background: "#111",
        borderTop: "1px solid #222",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        zIndex: 99990,
        transition: "transform 0.25s ease",
        transform: "translateY(0)",
      }}
    >
      {/* Thumbnail */}
      <div
        onClick={() => navigate(`/watch?v=${currentVideo.id}`)}
        style={{
          width: 48,
          height: 48,
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
          marginRight: 12,
        }}
      >
        <img
          src={currentVideo.thumbnail}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Title + channel */}
      <div
        onClick={() => navigate(`/watch?v=${currentVideo.id}`)}
        style={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentVideo.title}
        </div>
        <div
          style={{
            color: "#aaa",
            fontSize: 12,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentVideo.channelTitle}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Play/Pause */}
        <button
          onClick={() => (isPlaying ? pause() : play())}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#222",
            border: "1px solid #333",
            color: "#fff",
            fontSize: 14,
          }}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        {/* Close */}
        <button
          onClick={stop}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#222",
            border: "1px solid #333",
            color: "#fff",
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
