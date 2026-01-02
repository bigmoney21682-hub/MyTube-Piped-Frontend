/**
 * File: Playlists.jsx
 * Path: src/pages/Playlists.jsx
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";

export default function Playlists() {
  const navigate = useNavigate();
  const { playlists, deletePlaylist } = usePlaylists();

  return (
    <div style={{ paddingTop: "60px", padding: "16px", color: "#fff" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Playlists</h2>

      {playlists.length === 0 && (
        <div style={{ opacity: 0.7 }}>No playlists yet.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {playlists.map((pl) => (
          <div
            key={pl.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              background: "#111",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <div
              onClick={() => navigate(`/playlist/${pl.id}`)}
              style={{ flex: 1 }}
            >
              <div style={{ fontSize: "16px", fontWeight: 600 }}>{pl.name}</div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                {pl.videos.length} videos
              </div>
            </div>

            <button
              onClick={() => deletePlaylist(pl.id)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#b91c1c",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
