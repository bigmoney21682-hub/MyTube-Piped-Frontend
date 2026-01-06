/**
 * File: AddToPlaylistButton.jsx
 * Path: src/components/AddToPlaylistButton.jsx
 */

import React from "react";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";

export default function AddToPlaylistButton({ video }) {
  const { addToPlaylistPrompt } = usePlaylists();

  if (!video) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        addToPlaylistPrompt(video);
      }}
      style={{
        padding: "6px 10px",
        borderRadius: "20px",
        border: "none",
        background: "linear-gradient(90deg, #ff8c00, #ff4500, #ff0000)",
        color: "#fff",
        fontSize: "13px",
        cursor: "pointer",
        marginTop: "6px",
        width: "fit-content"
      }}
    >
      + Playlist
    </button>
  );
}
