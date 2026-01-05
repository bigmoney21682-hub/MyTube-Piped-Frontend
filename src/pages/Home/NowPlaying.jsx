/**
 * File: NowPlaying.jsx
 * Path: src/pages/Home/NowPlaying.jsx
 *
 * Minimal version — all autonext logic moved to PlayerShell.
 */

import React from "react";
import { usePlayer } from "../../player/PlayerContext.jsx";

export default function NowPlaying() {
  const { activeVideoId, playerMeta } = usePlayer();

  if (!activeVideoId) return null;

  return (
    <div style={{ padding: "12px 16px", color: "#fff" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
        {playerMeta.title}
      </h2>
      <div style={{ opacity: 0.7, fontSize: "13px" }}>
        {playerMeta.channel}
      </div>
    </div>
  );
}
