// File: src/contexts/PlayerContext.jsx
// PCC v4.0 — Global playback brain for YouTube-iframe-only architecture

import { createContext, useCallback, useContext, useState } from "react";

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Playlist / queue
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autonext mode: "none" | "playlist" | "related"
  const [autonextMode, setAutonextMode] = useState("none");

  // Related-based autonext list (for discovery mode)
  const [relatedList, setRelatedList] = useState([]);

  const log = (msg) => window.debugLog?.(`PlayerContext: ${msg}`);

  const normalizeId = (video) => {
    if (!video) return null;
    if (typeof video.id === "string") return video.id;
    if (typeof video.id?.videoId === "string") return video.id.videoId;
    return null;
  };

  // -----------------------------------
  // Core controls
  // -----------------------------------
  const playVideo = useCallback((video, list = null) => {
    if (!video) return;
    const id = normalizeId(video);
    log(`playVideo called for id=${id}`);

    if (Array.isArray(list) && list.length > 0) {
      // Playlist mode
      setPlaylist(list);
      const idx = list.findIndex(
        (v) => normalizeId(v) === id
      );
      setCurrentIndex(idx >= 0 ? idx : 0);
      setAutonextMode("playlist");
    } else {
      // Single video
      setPlaylist([video]);
      setCurrentIndex(0);
      // Leave autonextMode as-is; Watch may set "related"
    }

    setCurrentVideo(video);
    setPlaying(true);
  }, []);

  const pauseVideo = useCallback(() => {
    log("pauseVideo");
    setPlaying(false);
  }, []);

  const stopVideo = useCallback(() => {
    log("stopVideo");
    setPlaying(false);
    setCurrentVideo(null);
    setPlaylist([]);
    setCurrentIndex(0);
    setAutonextMode("none");
    setRelatedList([]);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  // -----------------------------------
  // Playlist navigation
  // -----------------------------------
  const playNextInPlaylist = useCallback(() => {
    if (!playlist || playlist.length === 0) return null;

    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextVideo = playlist[nextIndex];

    if (!nextVideo) return null;

    log(
      `playNextInPlaylist -> index ${currentIndex} -> ${nextIndex}, id=${normalizeId(
        nextVideo
      )}`
    );

    setCurrentIndex(nextIndex);
    setCurrentVideo(nextVideo);
    setPlaying(true);
    return nextVideo;
  }, [playlist, currentIndex]);

  const playPrev = useCallback(() => {
    if (!playlist || playlist.length <= 1) return;

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevVideo = playlist[prevIndex];

    log(
      `playPrev -> index ${currentIndex} -> ${prevIndex}, id=${normalizeId(
        prevVideo
      )}`
    );

    setCurrentIndex(prevIndex);
    setCurrentVideo(prevVideo);
    setPlaying(true);
  }, [playlist, currentIndex]);

  // -----------------------------------
  // Autonext brain
  // -----------------------------------
  const playNext = useCallback(() => {
    log(`playNext called, autonextMode=${autonextMode}`);

    // Playlist mode: deterministic next from playlist
    if (autonextMode === "playlist") {
      return playNextInPlaylist();
    }

    // Related mode: use first related item if present
    if (autonextMode === "related") {
      if (!relatedList || relatedList.length === 0) {
        log("Related list empty, no autonext");
        return null;
      }

      const next = relatedList[0];
      if (!next) return null;

      const nextId =
        typeof next.id === "string"
          ? next.id
          : typeof next.id?.videoId === "string"
          ? next.id.videoId
          : null;

      const nextVideo = {
        id: nextId || next.id,
        title: next.title || next.snippet?.title || "",
        author:
          next.author || next.channelTitle || next.snippet?.channelTitle || "",
        description: next.description || next.snippet?.description,
        thumbnail:
          next.thumbnail ||
          next.snippet?.thumbnails?.default?.url ||
          next.snippet?.thumbnails?.high?.url,
        fromRelated: true,
      };

      log(`Autonext (related) -> id=${normalizeId(nextVideo)}`);

      setCurrentVideo(nextVideo);
      setPlaying(true);
      return nextVideo;
    }

    // No autonext
    log("Autonext disabled, returning null");
    return null;
  }, [autonextMode, relatedList, playNextInPlaylist]);

  const value = {
    currentVideo,
    playing,
    playlist,
    currentIndex,
    autonextMode,
    relatedList,

    playVideo,
    pauseVideo,
    stopVideo,
    togglePlay,
    playNext,
    playPrev,

    setCurrentVideo,
    setPlaying,
    setPlaylist,
    setCurrentIndex,
    setAutonextMode,
    setRelatedList,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
