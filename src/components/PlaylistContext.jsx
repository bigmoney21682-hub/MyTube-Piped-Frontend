// File: src/components/PlayerContext.jsx
import React, { createContext, useContext, useState, useRef } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const playVideo = (video) => {
    setCurrentVideo(video);
    setPlaying(true);
  };

  const pauseVideo = () => setPlaying(false);
  const resumeVideo = () => setPlaying(true);
  const stopVideo = () => {
    setCurrentVideo(null);
    setPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentVideo,
        playing,
        playerRef,
        playVideo,
        pauseVideo,
        resumeVideo,
        stopVideo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
