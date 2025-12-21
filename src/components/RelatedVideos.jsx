// File: src/components/RelatedVideos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RelatedVideos({ videoId, apiKey, onDebugLog }) {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const log = (msg) => {
    if (typeof onDebugLog === "function") onDebugLog(msg);
    else window.debugLog?.(msg);
  };

  useEffect(() => {
    if (!videoId || !apiKey) return;

    const fetchRelated = async () => {
      log(`DEBUG: Fetching related videos for id: ${videoId}`);

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=5&key=${apiKey}`
        );
        const data = await res.json();

        if (data.error) {
          setError(data.error.message);
          log(`DEBUG: Related fetch error: ${data.error.message}`);
          return;
        }

        const validVideos = (data.items || []).filter((item) => item.id?.videoId);
        setVideos(validVideos);
        log(`DEBUG: Related videos fetched: ${validVideos.length} items`);
        setError(null);
      } catch (err) {
        setError(err.message);
        log(`DEBUG: Related fetch exception: ${err}`);
      }
    };

    fetchRelated();
  }, [videoId, apiKey]);

  if (error)
    return (
      <p style={{ color: "red", padding: 8 }}>
        Error loading related videos: {error}
      </p>
    );

  if (!videos.length) return <p style={{ padding: 8 }}>Loading related…</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "12px",
        maxHeight: "300px",
        overflowY: "auto",
        borderTop: "1px solid #222",
      }}
    >
      {videos.map((video, index) => (
        <Link
          key={video.id.videoId || index}
          to={`/watch/${video.id.videoId}`}
          style={{ color: "#fff", textDecoration: "none" }}
          onClick={() => log(`DEBUG: Related video clicked: ${video.snippet.title}`)}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
              width={80}
              height={45}
            />
            <span>{video.snippet.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
