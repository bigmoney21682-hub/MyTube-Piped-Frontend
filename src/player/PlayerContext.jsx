/**
 * File: PlayerContext.jsx
 * Path: src/player/PlayerContext.jsx
 * Description:
 *   Global player state for the new architecture.
 *   - Tracks current video ID
 *   - Exposes loadVideo()
 *   - No autonext logic here (handled by AutonextEngine + Home.jsx)
 */

import React, {
  createContext,
  useState,
  useCallback,
  useMemo
} from "react";

function dbg(label, data = {}) {
  console.group(`[PLAYERCTX] ${label}`);
  for (const k in data) console.log(k + ":", data[k]);
  console.groupEnd();
}

export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentId, setCurrentId] = useState(null);

  /**
   * Load a video globally.
   * - Updates currentId
   * - Tells GlobalPlayerFix to load the video
   * - Does NOT fetch related (Home.jsx handles that)
   */
  const loadVideo = useCallback((id) => {
    dbg("loadVideo()", { id });

    setCurrentId(id);

    // Global unified player
    window.GlobalPlayer?.loadVideo(id);
  }, []);

  /**
   * Stable context value
   */
  const value = useMemo(() => {
    return {
      currentId,
      loadVideo
    };
  }, [currentId, loadVideo]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
