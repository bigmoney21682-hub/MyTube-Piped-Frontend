// File: src/components/VideoCard.jsx

import { useNavigate } from "react-router-dom";
import { usePlaylists } from "./PlaylistContext";

export default function VideoCard({ video, onClick }) {
  const navigate = useNavigate();

  // 🛡️ Defensive: playlists may not be initialized yet
  let toggleFavorite = null;
  let isFavorite = () => false;

  try {
    const playlists = usePlaylists();
    if (playlists) {
      toggleFavorite = playlists.toggleFavorite;
      isFavorite = playlists.isFavorite || (() => false);
    }
  } catch {
    // playlists not ready — Musi-style fallback
  }

  function handleClick() {
    if (typeof onClick === "function") {
      onClick(video.id);
      return;
    }
    navigate(`/watch/${video.id}`);
  }

  function handleFavorite(e) {
    e.stopPropagation();
    if (typeof toggleFavorite === "function") {
      toggleFavorite(video);
    }
  }

  return (
    <div className="video-card" onClick={handleClick}>
      <img
        src={video.thumbnail}
        alt={video.title}
        loading="lazy"
      />

      <div className="video-info">
        <h4>{video.title}</h4>
        <p>{video.author}</p>

        {/* ⭐ Favorites are optional — never crash */}
        {toggleFavorite && (
          <button onClick={handleFavorite}>
            {isFavorite(video.id) ? "★" : "☆"}
          </button>
        )}
      </div>
    </div>
  );
}
