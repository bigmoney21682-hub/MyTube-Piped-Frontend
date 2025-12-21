// File: src/components/MiniPlayer.jsx
// Persistent miniplayer for background play support (Musi-style)

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MiniPlayer({ currentVideo, isPlaying, onTogglePlay, onClose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (currentVideo?.snippet?.title) {
      setTitle(currentVideo.snippet.title);
    } else {
      setTitle("Unknown Video");
    }
  }, [currentVideo]);

  if (!currentVideo) return null;

  const handleClick = () => {
    navigate(`/watch/${currentVideo.id}`);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "68px",
        background: "#111",
        borderTop: "1px solid #333",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        zIndex: 999,
        boxShadow: "0 -4px 12px rgba(0,0,0,0.5)",
      }}
    >
      {/* Thumbnail */}
      <img
        src={currentVideo.snippet?.thumbnails?.default?.url || ""}
        alt=""
        style={{
          width: 48,
          height: 48,
          borderRadius: 6,
          marginRight: 12,
          objectFit: "cover",
        }}
      />

      {/* Title + controls */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: 13, opacity: 0.7 }}>
          {currentVideo.snippet?.channelTitle || ""}
        </p>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePlay();
        }}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 32,
          cursor: "pointer",
          padding: "8px 16px",
        }}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
          padding: "8px",
        }}
      >
        ✕
      </button>

      {/* Tap anywhere else to go to Watch page */}
      <div
        onClick={handleClick}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />
    </div>
  );
}
