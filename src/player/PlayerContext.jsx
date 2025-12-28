/**
 * File: PlayerContext.jsx
 * Path: src/player/PlayerContext.jsx
 * Description: React context that exposes global playback state and control
 *              methods. Bridges GlobalPlayer (non-React) with the UI.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { GlobalPlayer } from "./GlobalPlayer.js";
import { debugBus } from "../debug/debugBus.js";
import { QueueStore } from "./QueueStore.jsx";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [autonextMode, setAutonextMode] = useState("related"); // "related" | "playlist"
  const [queue, setQueue] = useState(QueueStore.getQueue());

  // Keep queue in sync with QueueStore
  useEffect(() => {
    QueueStore.subscribe((newQueue) => {
      setQueue([...newQueue]);
    });
  }, []);

  // Initialize global player once
  useEffect(() => {
    GlobalPlayer.init();

    GlobalPlayer.onStateChange((state) => {
      switch (state) {
        case window.YT.PlayerState.PLAYING:
          setIsPlaying(true);
          setIsBuffering(false);
          break;

        case window.YT.PlayerState.PAUSED:
          setIsPlaying(false);
          break;

        case window.YT.PlayerState.BUFFERING:
          setIsBuffering(true);
          break;

        case window.YT.PlayerState.ENDED:
          setIsPlaying(false);
          break;

        default:
          break;
      }
    });

    GlobalPlayer.onEnded(() => {
      debugBus.player("PlayerContext → Video ended");

      if (autonextMode === "playlist") {
        const next = QueueStore.next();
        if (next) {
          debugBus.player("PlayerContext → Autonext (playlist) → " + next);
          loadVideo(next);
        }
        return;
      }

      if (autonextMode === "related") {
        debugBus.player("PlayerContext → Autonext (related) triggered");
        // Watch.jsx will handle fetching related videos and calling loadVideo
      }
    });
  }, [autonextMode]);

  // ------------------------------------------------------------
  // Control API exposed to UI
  // ------------------------------------------------------------

  function loadVideo(videoId) {
    debugBus.player("PlayerContext.loadVideo → " + videoId);
    setCurrentVideoId(videoId);
    GlobalPlayer.load(videoId);
  }

  function togglePlay() {
    if (isPlaying) GlobalPlayer.pause();
    else GlobalPlayer.play();
  }

  function queueAdd(videoId) {
    QueueStore.add(videoId);
  }

  function queueNext() {
    const next = QueueStore.next();
    if (next) loadVideo(next);
  }

  function queuePrev() {
    const prev = QueueStore.prev();
    if (prev) loadVideo(prev);
  }

  const value = {
    currentVideoId,
    isPlaying,
    isBuffering,
    autonextMode,
    setAutonextMode,
    queue,
    loadVideo,
    togglePlay,
    queueAdd,
    queueNext,
    queuePrev
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
