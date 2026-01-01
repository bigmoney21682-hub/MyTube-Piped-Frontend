/**
 * File: PlaylistContext.jsx
 * Path: src/contexts/PlaylistContext.jsx
 * Description: Global playlist manager with localStorage persistence.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { debugBus } from "../debug/debugBus.js";

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState([]);

  /* ------------------------------------------------------------
     Load from localStorage on mount
  ------------------------------------------------------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mytube_playlists");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setPlaylists(parsed);
          debugBus.log("PLAYLIST", `Loaded ${parsed.length} playlists`);
        }
      }
    } catch (err) {
      debugBus.log("PLAYLIST", "Error loading playlists: " + err?.message);
    }
  }, []);

  /* ------------------------------------------------------------
     Save to localStorage whenever playlists change
  ------------------------------------------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem("mytube_playlists", JSON.stringify(playlists));
      debugBus.log("PLAYLIST", "Persisted playlists");
    } catch (err) {
      debugBus.log("PLAYLIST", "Error saving playlists: " + err?.message);
    }
  }, [playlists]);

  /* ------------------------------------------------------------
     Create playlist
  ------------------------------------------------------------- */
  function addPlaylist(name) {
    const id = crypto.randomUUID();
    const newPlaylist = { id, name, videos: [] };

    setPlaylists((prev) => [...prev, newPlaylist]);
    debugBus.log("PLAYLIST", `Created playlist "${name}" (id=${id})`);

    return newPlaylist;
  }

  /* ------------------------------------------------------------
     Add video to playlist
  ------------------------------------------------------------- */
  function addVideoToPlaylist(playlistId, video) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, videos: [...p.videos, video] }
          : p
      )
    );

    debugBus.log(
      "PLAYLIST",
      `Added video ${video?.id} to playlist ${playlistId}`
    );
  }

  /* ------------------------------------------------------------
     Remove video from playlist
  ------------------------------------------------------------- */
  function removeVideoFromPlaylist(playlistId, videoId) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, videos: p.videos.filter((v) => v.id !== videoId) }
          : p
      )
    );

    debugBus.log(
      "PLAYLIST",
      `Removed video ${videoId} from playlist ${playlistId}`
    );
  }

  /* ------------------------------------------------------------
     Rename playlist
  ------------------------------------------------------------- */
  function renamePlaylist(playlistId, newName) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, name: newName } : p
      )
    );

    debugBus.log(
      "PLAYLIST",
      `Renamed playlist ${playlistId} → "${newName}"`
    );
  }

  /* ------------------------------------------------------------
     Delete playlist
  ------------------------------------------------------------- */
  function deletePlaylist(playlistId) {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    debugBus.log("PLAYLIST", `Deleted playlist ${playlistId}`);
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        addPlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        renamePlaylist,
        deletePlaylist
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  return useContext(PlaylistContext);
}
