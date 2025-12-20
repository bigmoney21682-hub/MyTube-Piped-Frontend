// File: src/contexts/PlayerContext.jsx

import { createContext, useContext, useState, useRef } from "react";
import Player from "../components/Player";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [src, setSrc] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const playerRef = useRef(null);

  return (
    <PlayerContext.Provider
      value={{
        src,
        setSrc,
        playing,
        setPlaying,
        title,
        setTitle,
        author,
        setAuthor,
        playerRef
      }}
    >
      {children}
      {src && (
        <Player
          ref={playerRef}
          src={src}
          playing={playing}
          title={title}
          author={author}
        />
      )}
    </PlayerContext.Provider>
  );
}
