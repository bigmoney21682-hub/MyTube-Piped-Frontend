// File: src/components/VideoCard.jsx
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const id = video.id;

  const thumb = video.snippet?.thumbnails?.medium?.url;
  const title = video.snippet?.title;
  const channel = video.snippet?.channelTitle;

  return (
    <div
      style={{ marginBottom: 20, cursor: "pointer" }}
      onClick={() => navigate(`/watch?v=${id}`)}
    >
      <img
        src={thumb}
        alt={title}
        style={{ width: "100%", borderRadius: 8 }}
      />
      <h3 style={{ margin: "8px 0", color: "#fff" }}>{title}</h3>
      <p style={{ margin: 0, color: "#aaa" }}>{channel}</p>
    </div>
  );
}
