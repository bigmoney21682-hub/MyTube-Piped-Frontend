// File: src/contexts/PlaylistContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem("playlists");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  function addPlaylist(name) {
    setPlaylists(prev => [
      ...prev,
      { id: crypto.randomUUID(), name, videos: [] },
    ]);
  }

  function renamePlaylist(id, name) {
    setPlaylists(prev =>
      prev.map(p => (p.id === id ? { ...p, name } : p))
    );
  }

  function deletePlaylist(id) {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }

  function addToPlaylist(playlistId, video) {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id !== playlistId) return p;
        if (p.videos.some(v => v.id === video.id)) return p;
        return { ...p, videos: [...p.videos, video] };
      })
    );
  }

  function reorderPlaylists(from, to) {
    setPlaylists(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        addPlaylist,
        renamePlaylist,
        deletePlaylist,
        addToPlaylist,
        reorderPlaylists,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  return useContext(PlaylistContext);
}
