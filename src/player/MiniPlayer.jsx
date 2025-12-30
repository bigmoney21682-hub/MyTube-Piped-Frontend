/**
 * File: MiniPlayer.jsx
 * Path: src/player/MiniPlayer.jsx
 * Description: MiniPlayer stacked above DebugOverlay and Footer.
 */

import React from "react";
import { usePlayer } from "./PlayerContext.jsx";
import { FOOTER_HEIGHT } from "../layout/Footer.jsx";

export default function MiniPlayer() {
  const player = usePlayer();
  const isVisible = player?.mini?.visible;
  const debugHeight = 0; // DebugOverlay auto-adjusts; MiniPlayer sits above it

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: FOOTER_HEIGHT + debugHeight,
        left: 0,
        width: "100%",
        height: 80,
        background: "#111",
        borderTop: "1px solid #333",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        boxSizing: "border-box"
      }}
    >
      <div style={{ flex: 1, color: "#fff" }}>
        {player.mini.title ?? "Playing…"}
      </div>

      <button
        onClick={player.mini.expand}
        style={{
          background: "#222",
          border: "1px solid #444",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 4,
          fontSize: 12
        }}
      >
        Open
      </button>
    </div>
  );
}
