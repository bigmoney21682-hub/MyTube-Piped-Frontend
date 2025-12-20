// File: src/components/VideoCard.jsx

import { useNavigate } from "react-router-dom";
import { usePlaylists } from "./PlaylistContext";
import { usePlayer } from "../contexts/PlayerContext";

export default function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = usePlaylists();
  const { setSrc, setPlaying, setTitle, setAuthor } = usePlayer();

  function handleClick() {
    if (typeof onClick === "function") {
      onClick(video.id);
      return;
    }

    // Musi-style: set audio player context
    setSrc(video.url || `https://www.youtube.com/watch?v=${video.id}`);
    setTitle(video.title);
    setAuthor(video.author);
    setPlaying(true);

    navigate(`/watch/${video.id}`);
  }

  return (
    <div className="video-card" onClick={handleClick}>
      <img src={video.thumbnail} alt={video.title} loading="lazy" />
      <div className="video-info">
        <h4>{video.title}</h4>
        <p>{video.author}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(video);
          }}
        >
          {isFavorite(video.id) ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
