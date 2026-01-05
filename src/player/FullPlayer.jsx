/**
 * File: FullPlayer.jsx
 * Path: src/player/FullPlayer.jsx
 * Description:
 *   Expanded full player UI.
 *
 *   Contains ONLY:
 *     - Global iframe container
 *     - Collapse button
 *
 *   All metadata + controls now live in NowPlaying.jsx
 */

import React from "react";

export default function FullPlayer({ onCollapse }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        position: "relative"
      }}
    >
      {/* ⭐ GlobalPlayerFix iframe mount point */}
      <div
        id="global-player-iframe"
        style={{
          width: "100%",
          height: "100%",
          background: "#000"
        }}
      />

      {/* Collapse button */}
      <button
        onClick={onCollapse}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "none",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
          zIndex: 10
        }}
      >
        ⇩
      </button>
    </div>
  );
}
