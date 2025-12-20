// File: src/components/VideoCard.jsx

import { useNavigate } from "react-router-dom";
import { usePlaylists } from "./PlaylistContext";

export default function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { addToPlaylist, removeFromPlaylist, isInPlaylist } = usePlaylists();

  const handleClick = () => {
    if (onClick) {
      onClick(video);
    } else {
      navigate(`/watch/${video.id}`);
    }
  };

  const handlePlaylistToggle = (e) => {
    e.stopPropagation();
    if (isInPlaylist(video.id)) {
      removeFromPlaylist(video.id);
    } else {
      addToPlaylist(video);
    }
  };

  return (
    <div
      className="video-card"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#111",
        color: "#fff",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{ width: "100%", display: "block" }}
        />
        <button
          onClick={handlePlaylistToggle}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(0,0,0,0.6)",
            border: "none",
            borderRadius: "50%",
            color: "#fff",
            width: 32,
            height: 32,
            cursor: "pointer",
          }}
        >
          {isInPlaylist(video.id) ? "✓" : "+"}
        </button>
      </div>
      <div style={{ padding: "0.5rem" }}>
        <h4 style={{ margin: 0, fontSize: "0.9rem" }}>{video.title}</h4>
        <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.7 }}>
          {video.author}
        </p>
      </div>
    </div>
  );
}
