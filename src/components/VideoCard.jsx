// File: src/components/VideoCard.jsx

import { useNavigate } from "react-router-dom";
import { usePlaylists } from "./PlaylistContext";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = usePlaylists();

  if (!video || !video.id) return null;

  function handleClick() {
    navigate(`/watch/${video.id}`);
  }

  return (
    <div className="video-card">
      <div
        className="thumbnail-wrapper"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
          />
        )}
      </div>

      <div className="video-info">
        <h4
          className="title"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          {video.title}
        </h4>

        <p className="author">{video.author}</p>

        <div className="video-actions">
          <button
            onClick={() => toggleFavorite(video)}
            aria-label="Toggle favorite"
          >
            {isFavorite(video.id) ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}
