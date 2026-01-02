/**
 * File: Playlists.jsx
 * Path: src/pages/Playlists.jsx
 * Description: Polished playlist list with right‑aligned actions.
 */

import React from "react";
import { Link } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";

export default function Playlists() {
  const {
    playlists,
    createPlaylist,
    renamePlaylist,
    deletePlaylist
  } = usePlaylists();

  function handleCreate() {
    const name = prompt("Name your playlist:");
    if (!name) return;
    createPlaylist(name);   // ⭐ FIXED — correct function
  }

  function handleRename(id, currentName) {
    const name = prompt("Rename playlist:", currentName);
    if (!name) return;
    renamePlaylist(id, name);
  }

  function handleDelete(id) {
    if (!confirm("Delete this playlist?")) return;
    deletePlaylist(id);
  }

  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "22px", fontWeight: "600" }}>
        Your Playlists
      </h2>

      {/* Create new playlist */}
      <button
        onClick={handleCreate}
        style={{
          padding: "10px 16px",
          background: "#1f1f1f",
          color: "#3ea6ff",
          border: "1px solid #333",
          borderRadius: "6px",
          marginBottom: "24px",
          fontSize: "15px",
          cursor: "pointer"
        }}
      >
        + New Playlist
      </button>

      {playlists.length === 0 && (
        <div style={{ opacity: 0.7 }}>You have no playlists yet.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {playlists.map((p) => (
          <div
            key={p.id}
            style={{
              paddingBottom: "14px",
              borderBottom: "1px solid #2a2a2a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {/* LEFT SIDE: Playlist name + count */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link
                to={`/playlist/${p.id}`}
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  background: "#181818",
                  border: "1px solid #333",
                  borderRadius: "6px",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "background 0.15s, border-color 0.15s"
                }}
              >
                {p.name}
              </Link>

              <div
                style={{
                  fontSize: "13px",
                  opacity: 0.7,
                  marginTop: "6px",
                  paddingLeft: "2px"
                }}
              >
                {p.videos.length} videos
              </div>
            </div>

            {/* RIGHT SIDE: Rename + Delete */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleRename(p.id, p.name)}
                style={{
                  padding: "7px 12px",
                  background: "#262626",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s"
                }}
              >
                Rename
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  padding: "7px 12px",
                  background: "#3a0000",
                  color: "#fff",
                  border: "1px solid #660000",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s"
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
