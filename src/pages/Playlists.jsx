// File: src/pages/Playlists.jsx

import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext";
import Header from "../components/Header";
import { useState } from "react";

export default function Playlists() {
  const navigate = useNavigate();
  const {
    playlists,
    setCurrentPlaylist,
    addPlaylist,
    renamePlaylist,
    deletePlaylist,
    movePlaylist,
  } = usePlaylists();

  const [dragIndex, setDragIndex] = useState(null);

  const handleAddPlaylist = () => {
    const name = prompt("Enter playlist name:");
    if (name) addPlaylist(name);
  };

  return (
    <div
      style={{
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--footer-height)",
        minHeight: "100vh",
        background: "var(--app-bg)",
        color: "#fff",
      }}
    >
      <Header />

      <div style={{ padding: 16 }}>
        <h2 style={{ marginBottom: 24 }}>📁 Playlists</h2>

        <button
          onClick={handleAddPlaylist}
          style={{
            padding: "10px 16px",
            background: "#ff0000",
            color: "white",
            border: "none",
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          ➕ New Playlist
        </button>

        {playlists.map((p, index) => (
          <div
            key={p.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              movePlaylist(dragIndex, index);
              setDragIndex(null);
            }}
            style={{
              padding: 16,
              marginBottom: 12,
              background: "#111",
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong
              onClick={() => {
                setCurrentPlaylist(p);
                navigate(`/playlist/${p.id}`);
              }}
              style={{ cursor: "pointer" }}
            >
              {p.name} ({p.videos.length})
            </strong>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => renamePlaylist(p.id, p.name)}>✏️</button>
              <button onClick={() => deletePlaylist(p.id)}>🗑️</button>
              <span style={{ cursor: "grab" }}>☰</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
