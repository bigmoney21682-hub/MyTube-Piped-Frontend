/**
 * File: PlayerContext.jsx
 * Path: src/player/PlayerContext.jsx
 * Description:
 *   Central player state + bridge to GlobalPlayer.
 *   - Single source of truth for:
 *       - activeVideoId
 *       - autonextMode ("related" | "playlist")
 *       - activePlaylistId
 *   - Guarantees:
 *       - No double loads
 *       - No stale state
 *       - Clean integration with GlobalPlayer + AutonextEngine
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";

import { GlobalPlayer } from "./GlobalPlayer.js";
import { AutonextEngine } from "./AutonextEngine.js";
import { debugBus } from "../debug/debugBus.js";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [autonextMode, setAutonextModeState] = useState("related"); // "related" | "playlist"
  const [activePlaylistId, setActivePlaylistIdState] = useState(null);

  /* ------------------------------------------------------------
     Public: loadVideo
     - Updates activeVideoId
     - Sends to GlobalPlayer
  ------------------------------------------------------------ */
  const loadVideo = useCallback((videoId) => {
    if (!videoId) return;

    debugBus.player("PlayerContext.loadVideo(" + videoId + ")");
    setActiveVideoId(videoId);
    GlobalPlayer.load(videoId);
  }, []);

  /* ------------------------------------------------------------
     Public: setAutonextMode
  ------------------------------------------------------------ */
  const setAutonextMode = useCallback((mode) => {
    if (mode !== "related" && mode !== "playlist") {
      debugBus.warn("PlayerContext.setAutonextMode → invalid mode", mode);
      return;
    }

    debugBus.player("PlayerContext.setAutonextMode(" + mode + ")");
    setAutonextModeState(mode);
  }, []);

  /* ------------------------------------------------------------
     Public: setActivePlaylistId
  ------------------------------------------------------------ */
  const setActivePlaylistId = useCallback((playlistId) => {
    debugBus.player(
      "PlayerContext.setActivePlaylistId(" + JSON.stringify(playlistId) + ")"
    );
    setActivePlaylistIdState(playlistId || null);
  }, []);

  /* ------------------------------------------------------------
     Wire autonext mode + playlist into AutonextEngine
  ------------------------------------------------------------ */
  useEffect(() => {
    debugBus.player(
      "PlayerContext → AutonextEngine config. mode = " +
        autonextMode +
        ", activePlaylistId = " +
        JSON.stringify(activePlaylistId) +
        ", activeVideoId = " +
        JSON.stringify(activeVideoId)
    );

    AutonextEngine.setConfig({
      mode: autonextMode,
      activePlaylistId,
      activeVideoId
    });
  }, [autonextMode, activePlaylistId, activeVideoId]);

  const value = {
    activeVideoId,
    autonextMode,
    activePlaylistId,
    loadVideo,
    setAutonextMode,
    setActivePlaylistId
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}
