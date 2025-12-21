// File: src/components/VideoCard.jsx
// Updated: Modern full-width responsive layout with thumbnail duration badge, clean metadata, and improved playlist button

import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext";

// Helper to format ISO duration (e.g., PT4M13S → 4:13)
function formatDuration(isoDuration) {
  if (!isoDuration) return "";
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { playlists, addToPlaylist } = usePlaylists();

  function handleClick() {
    if (typeof onClick === "function") {
      onClick(video.id);
      return;
    }
    navigate(`/watch/${video.id}`);
  }

  const handleAdd = (e) => {
    e.stopPropagation();

    if (playlists.length === 0) {
      const name = prompt("No playlists found. Enter name for a new playlist:");
      if (name) addToPlaylist(name, video);
      return;
    }

    // Scrollable selection prompt
    const playlistNames = playlists.map((p) => p.name);
    const choice = prompt(
      "Add to playlist:\n" + playlistNames.map((n, i) => `${i + 1}. ${n}`).join("\n")
    );

    const index = parseInt(choice) - 1;
    if (!isNaN(index) && playlists[index]) {
      addToPlaylist(playlists[index].id, video);
    }
  };

  const duration = formatDuration(video.duration);

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        borderRadius: 12,
        overflow: "hidden",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Thumbnail – full width with 16:9 aspect ratio */}
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Duration badge on thumbnail */}
        {duration && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {duration}
          </div>
        )}
      </div>

      {/* Clean metadata area */}
      <div style={{ padding: 12, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <h4
          style={{
            margin: "0 0 8px 0",
            fontSize: 16,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "#fff",
          }}
        >
          {video.title}
        </h4>

        <p style={{ margin: "0 0 8px 0", opacity: 0.8, fontSize: 14, color: "#fff" }}>
          {video.author}
        </p>

        {/* Bottom row: Duration + Playlist button */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, opacity: 0.7 }}>
            {duration || ""}
          </span>

          <button
            onClick={handleAdd}
            style={{
              background: "#ff0000",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Playlist
          </button>
        </div>
      </div>
    </div>
  );
}
