// File: src/contexts/PlaylistContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const PlaylistContext = createContext();

export const usePlaylists = () => useContext(PlaylistContext);

export function PlaylistProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("mytube_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("mytube_favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(video) {
    setFavorites(prev => {
      const exists = prev.find(v => v.id === video.id);
      if (exists) return prev.filter(v => v.id !== video.id);
      return [...prev, video];
    });
  }

  function isFavorite(id) {
    return favorites.some(v => v.id === id);
  }

  return (
    <PlaylistContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </PlaylistContext.Provider>
  );
}
