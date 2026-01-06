/**
 * File: PlayerShell.jsx
 * Path: src/player/PlayerShell.jsx
 * Description:
 *   Wraps the YouTube iframe container.
 *   Now includes full debugging for Mac Web Inspector.
 */

import React, { useEffect, useContext } from "react";
import { PlayerContext } from "./PlayerContext.jsx";

// ------------------------------------------------------------
// Debug helper
// ------------------------------------------------------------
function dbg(label, data = {}) {
  console.group(`[PlayerShell] ${label}`);
  for (const k in data) console.log(k + ":", data[k]);
  console.groupEnd();
}

export default function PlayerShell() {
  const { currentId, onVideoEnd } = useContext(PlayerContext);

  // ------------------------------------------------------------
  // Component mount/unmount
  // ------------------------------------------------------------
  useEffect(() => {
    dbg("MOUNT");

    return () => {
      dbg("UNMOUNT");
    };
  }, []);

  // ------------------------------------------------------------
  // Log ID changes
  // ------------------------------------------------------------
  useEffect(() => {
    dbg("currentId changed", { currentId });
  }, [currentId]);

  // ------------------------------------------------------------
  // Hook into GlobalPlayer events
  // ------------------------------------------------------------
  useEffect(() => {
    if (!window.GlobalPlayer) {
      dbg("GlobalPlayer missing");
      return;
    }

    dbg("Binding GlobalPlayer events");

    const original = window.GlobalPlayer.player?.onStateChange;

    window.GlobalPlayer.player.onStateChange = (e) => {
      dbg("onStateChange", { state: e.data });

      // YouTube state 0 = ended
      if (e.data === 0) {
        dbg("Video ended → calling onVideoEnd()");
        onVideoEnd();
      }

      if (original) original(e);
    };
  }, [onVideoEnd]);

  return (
    <div
      id="yt-player"
      style={{
        width: "100%",
        height: "100%",
        background: "black"
      }}
    />
  );
}
