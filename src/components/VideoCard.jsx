// File: src/components/VideoCard.jsx
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext";
import { usePlayer } from "../contexts/PlayerContext";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = usePlaylists();
  const { playVideo, currentVideo, playing } = usePlayer();

  function handleClick() {
    // Play video in global player
    playVideo(video);
    navigate(`/watch/${video.id}`);
  }

  return (
    <div className="video-card" onClick={handleClick}>
      <img src={video.thumbnail} alt={video.title} loading="lazy" />
      <div className="video-info">
        <h4>{video.title}</h4>
        <p>{video.author}</p>
        <button
          onClick={e => {
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
