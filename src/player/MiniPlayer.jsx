/**
 * File: MiniPlayer.jsx
 * Path: src/player/MiniPlayer.jsx
 * Description: MiniPlayer stacked above DebugOverlay and Footer.
 */

import React from "react";
import { usePlayer } from "./PlayerContext.jsx";
import { FOOTER_HEIGHT } from "../layout/Footer.jsx";
import { normalizeId } from "../utils/normalizeId.js";

export default function MiniPlayer() {
  const player = usePlayer();
  const isVisible = player?.mini?.visible;
  const debugHeight = 0;

  if (!isVisible) return null;

  // ⭐ Extract and validate the current video ID
  const raw = player?.current ?? player?.mini ?? {};
  const vidId = normalizeId(raw);

  function safeExpand() {
    if (!vidId) {
      window.bootDebug?.warn("MiniPlayer → expand blocked: invalid video ID", raw);
      return;
    }

    // Call the original expand function
    player.mini.expand(vidId);
  }

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
        onClick={safeExpand}
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
