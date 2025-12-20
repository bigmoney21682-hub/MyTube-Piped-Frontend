// File: src/contexts/PlayerContext.jsx
import { createContext, useContext, useState, useRef } from "react";
import Player from "../components/Player";

const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  function playVideo(video) {
    setCurrentVideo(video);
    setPlaying(true);
  }

  function pauseVideo() {
    setPlaying(false);
  }

  function stopVideo() {
    setPlaying(false);
    setCurrentVideo(null);
  }

  return (
    <PlayerContext.Provider
      value={{ currentVideo, playing, playVideo, pauseVideo, stopVideo }}
    >
      {children}

      {/* Global hidden audio player */}
      {currentVideo && (
        <div style={{ display: "none" }}>
          <Player
            ref={playerRef}
            src={`https://www.youtube.com/watch?v=${currentVideo.id}`}
            playing={playing}
            onEnded={stopVideo}
          />
        </div>
      )}
    </PlayerContext.Provider>
  );
}
