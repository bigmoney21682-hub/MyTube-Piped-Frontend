// File: src/pages/Playlists.jsx
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext";
import Header from "../components/Header";
import { useState, useRef } from "react";

export default function Playlists() {
  const navigate = useNavigate();
  const {
    playlists,
    setCurrentPlaylist,
    addPlaylist,
    renamePlaylist,
    deletePlaylist,
    reorderPlaylists,
  } = usePlaylists();

  const [draggingId, setDraggingId] = useState(null);
  const dragStartIndex = useRef(null);

  const handleAddPlaylist = () => {
    const name = prompt("Enter playlist name:");
    if (name) addPlaylist(name);
  };

  const handleRename = (id, currentName) => {
    const newName = prompt("Enter new name:", currentName);
    if (newName) renamePlaylist(id, newName);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete playlist "${name}"? This cannot be undone.`)) {
      deletePlaylist(id);
    }
  };

  const handleDragStart = (id, index) => {
    setDraggingId(id);
    dragStartIndex.current = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (index) => {
    if (dragStartIndex.current === null) return;
    reorderPlaylists(dragStartIndex.current, index);
    setDraggingId(null);
    dragStartIndex.current = null;
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
            fontSize: "1rem",
            marginBottom: 24,
            cursor: "pointer",
          }}
        >
          ➕ New Playlist
        </button>

        {playlists.map((p, index) => (
          <div
            key={p.id}
            draggable
            onDragStart={() => handleDragStart(p.id, index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            style={{
              padding: 16,
              marginBottom: 12,
              background: draggingId === p.id ? "#222" : "#111",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              touchAction: "none",
            }}
          >
            <strong
              onClick={() => {
                setCurrentPlaylist(p);
                navigate(`/playlist/${p.id}`);
              }}
              style={{ cursor: "pointer", fontSize: "1.1rem" }}
            >
              {p.name} ({p.videos.length} videos)
            </strong>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Edit/Delete buttons moved left */}
              <button onClick={() => handleRename(p.id, p.name)}>✏️</button>
              <button onClick={() => handleDelete(p.id, p.name)}>🗑️</button>

              {/* Drag handle on right */}
              <span
                style={{
                  cursor: "grab",
                  fontSize: 20,
                  padding: "0 6px",
                  userSelect: "none",
                }}
              >
                ☰
              </span>
            </div>
          </div>
        ))}

        {playlists.length === 0 && (
          <p style={{ opacity: 0.7, textAlign: "center" }}>
            No playlists yet. Create one!
          </p>
        )}
      </div>
    </div>
  );
}
