/**
 * File: Playlists.jsx
 * Path: src/pages/Playlists.jsx
 * Description: Lists all playlists with video counts and navigation
 *              into individual Playlist pages. Playlist names are
 *              now styled as clickable buttons.
 */

import React from "react";
import { Link } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";

export default function Playlists() {
  const { playlists, addPlaylist } = usePlaylists();

  function handleCreate() {
    const name = prompt("Name your playlist:");
    if (!name) return;
    addPlaylist(name);
  }

  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      <h2 style={{ marginBottom: "16px" }}>Your Playlists</h2>

      <button
        onClick={handleCreate}
        style={{
          padding: "10px 16px",
          background: "#222",
          color: "#3ea6ff",
          border: "1px solid #444",
          borderRadius: "4px",
          marginBottom: "20px"
        }}
      >
        + New Playlist
      </button>

      {playlists.length === 0 && (
        <div style={{ opacity: 0.7 }}>You have no playlists yet.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {playlists.map((p) => (
          <div
            key={p.id}
            style={{
              paddingBottom: "12px",
              borderBottom: "1px solid #333"
            }}
          >
            {/* Playlist name as a button */}
            <Link
              to={`/playlist/${p.id}`}
              style={{
                display: "inline-block",
                padding: "10px 14px",
                background: "#222",
                border: "1px solid #444",
                borderRadius: "6px",
                color: "#fff",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "bold",
                marginBottom: "6px"
              }}
            >
              {p.name}
            </Link>

            {/* Video count */}
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: "4px" }}>
              {p.videos.length} videos
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
