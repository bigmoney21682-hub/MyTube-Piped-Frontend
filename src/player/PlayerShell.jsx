/**
 * File: PlayerShell.jsx
 * Path: src/player/PlayerShell.jsx
 */

console.log("PlayerShell.jsx → FILE LOADED");
window.bootDebug?.player("PlayerShell.jsx → FILE LOADED");

import React, { useEffect } from "react";
import { usePlayer } from "./PlayerContext.jsx";

import { GlobalPlayer } from "./GlobalPlayerFix.js";

import MiniPlayer from "./MiniPlayer.jsx";
import FullPlayer from "./FullPlayer.jsx";

export default function PlayerShell() {
  const {
    activeVideoId,
    isExpanded,
    expandPlayer,
    collapsePlayer,
    playerMeta,
    setPlayerHeight
  } = usePlayer();

  if (!activeVideoId) return null;

  // ⭐ Determine height (used by App.jsx)
  const height = isExpanded ? 220 : 48;

  // ⭐ Report height to context (smooth content shift)
  useEffect(() => {
    setPlayerHeight(height);
  }, [height, setPlayerHeight]);

  // ⭐ Initialize GlobalPlayer AFTER mount exists
  useEffect(() => {
    try {
      GlobalPlayer.init();
      window.bootDebug?.player("PlayerShell → GlobalPlayer.init() OK");
    } catch (err) {
      window.bootDebug?.player("PlayerShell → GlobalPlayer.init() FAILED");
      console.warn(err);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        background: "#000",
        position: "fixed",
        top: "60px",
        left: 0,
        right: 0,
        zIndex: 900,
        transition: "height 0.25s ease",
        height,
        overflow: "hidden",
        borderBottom: "1px solid #222"
      }}
    >
      {isExpanded && (
        <FullPlayer
          onCollapse={collapsePlayer}
          meta={playerMeta}
        />
      )}

      {!isExpanded && (
        <MiniPlayer
          meta={playerMeta}
          onExpand={expandPlayer}
        />
      )}
    </div>
  );
}
