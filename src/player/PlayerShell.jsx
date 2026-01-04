/**
 * ------------------------------------------------------------
 * File: PlayerShell.jsx
 * Path: src/player/PlayerShell.jsx
 * Description:
 *   Global player wrapper that sits directly under the Header.
 *   Controls:
 *     - MiniPlayer (collapsed)
 *     - FullPlayer (expanded)
 *
 *   Behavior:
 *     - Always mounted
 *     - Never reloads the iframe
 *     - Expands/collapses via PlayerContext
 * ------------------------------------------------------------
 */

import React from "react";
import { usePlayer } from "./PlayerContext.jsx";

import MiniPlayer from "./MiniPlayer.jsx";
import FullPlayer from "./FullPlayer.jsx";

export default function PlayerShell() {
  const {
    activeVideoId,
    isExpanded,
    expandPlayer,
    collapsePlayer,
    playerMeta
  } = usePlayer();

  // No video loaded → render nothing
  if (!activeVideoId) return null;

  return (
    <div
      style={{
        width: "100%",
        background: "#000",
        position: "fixed",
        top: "60px", // directly under Header
        left: 0,
        right: 0,
        zIndex: 900,
        transition: "height 0.25s ease",
        height: isExpanded ? "220px" : "48px",
        overflow: "hidden",
        borderBottom: "1px solid #222"
      }}
    >
      {/* Expanded full player */}
      {isExpanded && (
        <FullPlayer
          onCollapse={collapsePlayer}
          meta={playerMeta}
        />
      )}

      {/* Collapsed mini player */}
      {!isExpanded && (
        <MiniPlayer
          meta={playerMeta}
          onExpand={expandPlayer}
        />
      )}
    </div>
  );
}
