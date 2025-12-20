// File: src/components/VideoCard.jsx
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext";
import { useState } from "react";

export default function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { playlists, addPlaylist, addToPlaylist } = usePlaylists();
  const [showSelect, setShowSelect] = useState(false);

  function handleClick() {
    if (typeof onClick === "function") {
      onClick(video.id);
      return;
    }
    navigate(`/watch/${video.id}`);
  }

  function handleAddClick(e) {
    e.stopPropagation();
    if (playlists.length === 0) {
      const name = prompt("No playlists yet. Enter new playlist name:");
      if (name) {
        addPlaylist(name);
        const p = playlists.find((p) => p.name === name);
        if (p) addToPlaylist(p.id, video);
      }
      return;
    }
    setShowSelect(true);
  }

  function handleSelect(playlistId) {
    addToPlaylist(playlistId, video);
    setShowSelect(false);
  }

  function handleCreateNew() {
    const name = prompt("Enter new playlist name:");
    if (!name) return;
    addPlaylist(name);
    const p = playlists.find((p) => p.name === name);
    if (p) addToPlaylist(p.id, video);
    setShowSelect(false);
  }

  return (
    <div className="video-card" onClick={handleClick}>
      <img src={video.thumbnail} alt={video.title} loading="lazy" />

      <div className="video-info">
        <h4>{video.title}</h4>
        <p>{video.author}</p>

        <button onClick={handleAddClick}>+ Playlist</button>

        {/* Playlist selection modal */}
        {showSelect && (
          <div
            style={{
              position: "absolute",
              background: "#111",
              color: "#fff",
              padding: 16,
              borderRadius: 12,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2000,
              maxHeight: 300,
              overflowY: "auto",
              width: 250,
            }}
          >
            <strong>Select a playlist:</strong>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 12,
              }}
            >
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  style={{
                    padding: "6px 10px",
                    background: "#222",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {p.name} ({p.videos.length})
                </button>
              ))}
              <button
                onClick={handleCreateNew}
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  background: "#ff0000",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                + Create new playlist
              </button>
              <button
                onClick={() => setShowSelect(false)}
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  background: "#555",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
