// File: src/player/PlayerContext.jsx
// Description:
//   Global player state + safe video loading + autonext mode.
//   Includes ID normalizer to prevent "Invalid video id" crashes.

import React, { createContext, useContext, useState, useCallback } from "react";
import { GlobalPlayer } from "./GlobalPlayer.js";
import { debugBus } from "../debug/debugBus.js";

const PlayerContext = createContext(null);

/* ------------------------------------------------------------
   NORMALIZE VIDEO ID (CRITICAL FIX)
------------------------------------------------------------ */
function normalizeId(raw) {
  if (!raw) return null;

  // Already a string
  if (typeof raw === "string") return raw;

  // { id: "abc123" }
  if (typeof raw.id === "string") return raw.id;

  // { videoId: "abc123" }
  if (typeof raw.videoId === "string") return raw.videoId;

  // { id: { videoId: "abc123" } }
  if (raw.id && typeof raw.id.videoId === "string") return raw.id.videoId;

  // { snippet: { resourceId: { videoId: "abc123" } } }
  if (raw.snippet?.resourceId?.videoId) return raw.snippet.resourceId.videoId;

  return null;
}

/* ------------------------------------------------------------
   PROVIDER
------------------------------------------------------------ */
export function PlayerProvider({ children }) {
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [autonextMode, setAutonextModeState] = useState("related"); // "related" | "playlist"
  const [activePlaylistId, setActivePlaylistIdState] = useState(null);

  /* ------------------------------------------------------------
     SAFE loadVideo() — ALWAYS receives a clean ID
  ------------------------------------------------------------ */
  const loadVideo = useCallback((raw) => {
    const id = normalizeId(raw);

    if (!id) {
      debugBus.error("PlayerContext → Invalid video id:", raw);
      return;
    }

    debugBus.player("PlayerContext → loadVideo(" + id + ")");
    setCurrentVideoId(id);

    // Pass clean ID to GlobalPlayer
    GlobalPlayer.load(id);
  }, []);

  /* ------------------------------------------------------------
     AUTONEXT MODE
  ------------------------------------------------------------ */
  const setAutonextMode = useCallback((mode) => {
    debugBus.player("PlayerContext → setAutonextMode(" + mode + ")");
    setAutonextModeState(mode);
  }, []);

  /* ------------------------------------------------------------
     ACTIVE PLAYLIST ID
  ------------------------------------------------------------ */
  const setActivePlaylistId = useCallback((plId) => {
    debugBus.player("PlayerContext → setActivePlaylistId(" + plId + ")");
    setActivePlaylistIdState(plId);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentVideoId,
        loadVideo,
        autonextMode,
        setAutonextMode,
        activePlaylistId,
        setActivePlaylistId
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
