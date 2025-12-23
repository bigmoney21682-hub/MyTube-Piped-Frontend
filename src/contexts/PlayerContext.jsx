// File: src/contexts/PlayerContext.jsx
// PCC v3.0 — Centralized player state with autonext (playlist + related)

import { createContext, useContext, useState, useCallback } from "react";

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Playlist-based state
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autonext mode: "none" | "playlist" | "related"
  const [autonextMode, setAutonextMode] = useState("none");

  // Related-based autonext list (for discovery mode)
  const [relatedList, setRelatedList] = useState([]);

  // -----------------------------------
  // Core controls
  // -----------------------------------
  const playVideo = useCallback((video, list = null) => {
    if (Array.isArray(list) && list.length > 0) {
      // Playlist mode
      setPlaylist(list);
      const idx = list.findIndex(
        (v) =>
          v.id === video.id ||
          v.id?.videoId === video.id ||
          v.id === video.id?.videoId
      );
      setCurrentIndex(idx >= 0 ? idx : 0);
      setAutonextMode("playlist");
    } else if (video) {
      // Single video mode (discovery / related)
      setPlaylist([video]);
      setCurrentIndex(0);
      // Do not force autonextMode here; Watch will decide (e.g. "related")
    }

    setCurrentVideo(video);
    setPlaying(true);
  }, []);

  const pauseVideo = useCallback(() => {
    setPlaying(false);
  }, []);

  const stopVideo = useCallback(() => {
    setPlaying(false);
    setCurrentVideo(null);
    setPlaylist([]);
    setCurrentIndex(0);
    setAutonextMode("none");
    setRelatedList([]);
  }, []);

  // -----------------------------------
  // Playlist navigation
  // -----------------------------------
  const playNextInPlaylist = useCallback(() => {
    if (!playlist || playlist.length === 0) return null;

    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextVideo = playlist[nextIndex];

    if (!nextVideo) return null;

    setCurrentIndex(nextIndex);
    setCurrentVideo(nextVideo);
    setPlaying(true);
    return nextVideo;
  }, [playlist, currentIndex]);

  const playPrev = useCallback(() => {
    if (!playlist || playlist.length <= 1) return;

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevVideo = playlist[prevIndex];

    setCurrentIndex(prevIndex);
    setCurrentVideo(prevVideo);
    setPlaying(true);
  }, [playlist, currentIndex]);

  // -----------------------------------
  // Autonext brain
  // -----------------------------------
  const playNext = useCallback(() => {
    // Playlist mode: deterministic next from playlist
    if (autonextMode === "playlist") {
      return playNextInPlaylist();
    }

    // Related mode: use first related item if present
    if (autonextMode === "related") {
      if (!relatedList || relatedList.length === 0) return null;

      const next = relatedList[0];
      if (!next) return null;

      // Normalize shape a bit: allow either {id, title, ...} or YouTube-like
      const nextId =
        typeof next.id === "string"
          ? next.id
          : typeof next.id?.videoId === "string"
          ? next.id.videoId
          : null;

      const nextVideo = {
        id: nextId || next.id,
        title: next.title || next.snippet?.title || "",
        author: next.author || next.channelTitle || next.snippet?.channelTitle,
        description: next.description || next.snippet?.description,
        thumbnail:
          next.thumbnail ||
          next.snippet?.thumbnails?.default?.url ||
          next.snippet?.thumbnails?.high?.url,
        fromRelated: true,
      };

      setCurrentVideo(nextVideo);
      setPlaying(true);
      return nextVideo;
    }

    // No autonext
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
      {/* Background engine (GlobalPlayer) mounts separately at app root */}
    </PlayerContext.Provider>
  );
}
