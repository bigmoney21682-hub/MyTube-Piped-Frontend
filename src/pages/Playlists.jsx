/**
 * File: Playlists.jsx
 * Path: src/pages/Playlists.jsx
 * Description: Lists all playlists with create/delete/rename options.
 */

import React from "react";
import { Link } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";

export default function Playlists() {
  const { playlists, createPlaylist, deletePlaylist, renamePlaylist } = usePlaylists();

  function handleCreate() {
    const name = prompt("New playlist name:");
    if (name && name.trim()) createPlaylist(name.trim());
  }

  function handleRename(id, oldName) {
    const newName = prompt("Rename playlist:", oldName);
    if (newName && newName.trim()) renamePlaylist(id, newName.trim());
  }

  return (
    <div style={{ padding: "16px", paddingTop: "var(--header-height)" }}>
      <h2>Your Playlists</h2>

      <button
        onClick={handleCreate}
        style={{
          marginTop: "12px",
          padding: "10px 16px",
          background: "#222",
          color: "#3ea6ff",
          border: "1px solid #444",
          borderRadius: "6px"
        }}
      >
        + New Playlist
      </button>

      <div style={{ marginTop: "20px" }}>
        {playlists.map((p) => (
          <div
            key={p.id}
            style={{
              padding: "12px",
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Link
              to={`/playlist/${p.id}`}
              style={{ color: "#fff", textDecoration: "none", fontSize: "16px" }}
            >
              {p.name}
            </Link>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleRename(p.id, p.name)}
                style={{
                  background: "none",
                  border: "1px solid #444",
                  color: "#3ea6ff",
                  padding: "4px 8px",
                  borderRadius: "6px"
                }}
              >
                Rename
              </button>

              <button
                onClick={() => deletePlaylist(p.id)}
                style={{
                  background: "none",
                  border: "1px solid #444",
                  color: "#ff4444",
                  padding: "4px 8px",
                  borderRadius: "6px"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
