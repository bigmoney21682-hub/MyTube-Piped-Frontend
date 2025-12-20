// File: src/contexts/PlaylistContext.jsx

import { createContext, useContext, useState } from "react";

/*
  Playlist shape:
  {
    id: string,
    name: string,
    videos: []
  }
*/

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  /* ------------------------
     PLAYLIST CRUD
  -------------------------*/

  function addPlaylist(name) {
    setPlaylists((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        videos: [],
      },
    ]);
  }

  function renamePlaylist(id, newName) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: newName } : p
      )
    );
  }

  function deletePlaylist(id) {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));

    if (currentPlaylist?.id === id) {
      setCurrentPlaylist(null);
    }
  }

  /* ------------------------
     VIDEO MANAGEMENT
  -------------------------*/

  function addToPlaylist(playlistId, video) {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;

        // prevent duplicates
        if (p.videos.some((v) => v.id === video.id)) {
          return p;
        }

        return {
          ...p,
          videos: [...p.videos, video],
        };
      })
    );
  }

  function removeFromPlaylist(playlistId, videoId) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              videos: p.videos.filter((v) => v.id !== videoId),
            }
          : p
      )
    );
  }

  /* ------------------------
     PLAYLIST REORDERING
  -------------------------*/

  function movePlaylist(fromIndex, toIndex) {
    setPlaylists((prev) => {
      if (
        fromIndex === null ||
        toIndex === null ||
        fromIndex === toIndex
      ) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  /* ------------------------
     CONTEXT VALUE
  -------------------------*/

  const value = {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,

    addPlaylist,
    renamePlaylist,
    deletePlaylist,

    addToPlaylist,
    removeFromPlaylist,

    movePlaylist,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}

/* ------------------------
   HOOK
-------------------------*/

export function usePlaylists() {
  const ctx = useContext(PlaylistContext);
  if (!ctx) {
    throw new Error(
      "usePlaylists must be used inside PlaylistProvider"
    );
  }
  return ctx;
}
