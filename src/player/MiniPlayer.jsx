/**
 * File: MiniPlayer.jsx
 * Description:
 *   Compact bar under the player.
 *   - Expand/Collapse button
 *   - Play/Pause button
 *   - Title + thumbnail
 */

import React, { useContext } from "react";
import { PlayerContext } from "./PlayerContext.jsx";

export default function MiniPlayer({ onExpand, onCollapse }) {
  const { currentId, currentMeta, isPlaying, setIsPlaying } =
    useContext(PlayerContext);

  if (!currentId) return null;

  const title = currentMeta?.title || "Now playing";
  const thumbnail = currentMeta?.thumbnail || "";

  return (
    <div
      style={{
        width: "100%",
        background: "#111",
        borderBottom: "1px solid #222",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "sticky",
        top: 220, // ⭐ sits right under the player
        zIndex: 5000
      }}
    >
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt=""
        style={{
          width: 48,
          height: 48,
          borderRadius: 6,
          objectFit: "cover"
        }}
      />

      {/* Title */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: 14,
          fontWeight: 600
        }}
      >
        {title}
      </div>

      {/* Play/Pause */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(!isPlaying);
        }}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "none",
          background: "linear-gradient(90deg, #ff8c00, #ff4500, #ff0000)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Expand/Collapse */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onExpand();
        }}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "none",
          background: "#333",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600
        }}
      >
        Expand
      </button>
    </div>
  );
}
