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
  const [queue, setQueue] = useState(() => {
    try {
      return QueueStore.getQueue() ?? [];
    } catch {
      return [];
    }
  });

  // ------------------------------------------------------------
  // Keep queue in sync with QueueStore
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      QueueStore.subscribe((newQueue) => {
        setQueue(Array.isArray(newQueue) ? [...newQueue] : []);
      });
    } catch (err) {
      debugBus.player("PlayerContext → QueueStore.subscribe error: " + err?.message);
    }
  }, []);

  // ------------------------------------------------------------
  // Initialize GlobalPlayer once
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      GlobalPlayer.init();
    } catch (err) {
      debugBus.player("PlayerContext → GlobalPlayer.init error: " + err?.message);
      return;
    }

    // Safe guard: window.YT may not exist yet
    const YTState = window?.YT?.PlayerState ?? {};

    try {
      GlobalPlayer.onStateChange((state) => {
        switch (state) {
          case YTState.PLAYING:
            setIsPlaying(true);
            setIsBuffering(false);
            break;

          case YTState.PAUSED:
            setIsPlaying(false);
            break;

          case YTState.BUFFERING:
            setIsBuffering(true);
            break;

          case YTState.ENDED:
            setIsPlaying(false);
            break;

          default:
            break;
        }
      });
    } catch (err) {
      debugBus.player("PlayerContext → onStateChange error: " + err?.message);
    }

    try {
      GlobalPlayer.onEnded(() => {
        debugBus.player("PlayerContext → Video ended");

        if (autonextMode === "playlist") {
          const next = QueueStore.next?.() ?? null;
          if (next) {
            debugBus.player("PlayerContext → Autonext (playlist) → " + next);
            loadVideo(next);
          }
          return;
        }

        if (autonextMode === "related") {
          debugBus.player("PlayerContext → Autonext (related) triggered");
          // Watch.jsx handles fetching related videos + calling loadVideo
        }
      });
    } catch (err) {
      debugBus.player("PlayerContext → onEnded error: " + err?.message);
    }
  }, [autonextMode]);

  // ------------------------------------------------------------
  // Control API exposed to UI
  // ------------------------------------------------------------

  function loadVideo(videoId) {
    if (!videoId) return;

    debugBus.player("PlayerContext.loadVideo → " + videoId);
    setCurrentVideoId(videoId);

    try {
      GlobalPlayer.load(videoId);
    } catch (err) {
      debugBus.player("PlayerContext → GlobalPlayer.load error: " + err?.message);
    }
  }

  function togglePlay() {
    try {
      if (isPlaying) GlobalPlayer.pause();
      else GlobalPlayer.play();
    } catch (err) {
      debugBus.player("PlayerContext → togglePlay error: " + err?.message);
    }
  }

  function queueAdd(videoId) {
    try {
      QueueStore.add(videoId);
    } catch (err) {
      debugBus.player("PlayerContext → queueAdd error: " + err?.message);
    }
  }

  function queueNext() {
    try {
      const next = QueueStore.next?.() ?? null;
      if (next) loadVideo(next);
    } catch (err) {
      debugBus.player("PlayerContext → queueNext error: " + err?.message);
    }
  }

  function queuePrev() {
    try {
      const prev = QueueStore.prev?.() ?? null;
      if (prev) loadVideo(prev);
    } catch (err) {
      debugBus.player("PlayerContext → queuePrev error: " + err?.message);
    }
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
  return useContext(PlayerContext) ?? {};
}
