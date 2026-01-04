/**
 * File: MiniPlayer.jsx
 * Path: src/player/MiniPlayer.jsx
 */

import React from "react";

export default function MiniPlayer({ meta, onExpand }) {
  const { title, channel } = meta;

  return (
    <div
      style={{
        width: "100%",
        height: "48px",
        background: "#000",
        display: "flex",
        alignItems: "center",
        padding: "6px 10px",
        position: "relative"
      }}
      onClick={onExpand}
    >
      {/* ⭐ GlobalPlayer_v2 iframe mount point (same as FullPlayer) */}
      <div
        id="global-player-iframe"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,          // invisible but present
          pointerEvents: "none" // MiniPlayer UI stays clickable
        }}
      />

      {/* Thumbnail + text */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "11px",
            opacity: 0.7,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {channel}
        </div>
      </div>

      {/* Expand icon */}
      <div style={{ fontSize: "18px", paddingLeft: "10px" }}>⇧</div>
    </div>
  );
}
