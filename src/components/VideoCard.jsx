// File: src/components/VideoCard.jsx
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext";

export default function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { addToPlaylist } = usePlaylists();

  function handleClick() {
    if (typeof onClick === "function") {
      onClick(video.id);
      return;
    }
    navigate(`/watch/${video.id}`);
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToPlaylist(video);
          }}
        >
          + Playlist
        </button>
      </div>
    </div>
  );
}
