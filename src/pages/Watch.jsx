import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");

  // Fetch video metadata from Piped backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://mytube-python-backend.onrender.com/video/${id}`);
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error("Error fetching video metadata:", err);
      }
    })();
  }, [id]);

  // Fetch video stream from your yt-dlp backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://my-yt-dlp-backend.onrender.com/stream/${id}`);
        const data = await res.json();
        setStreamUrl(data.url); // assuming backend returns { url: "..." }
      } catch (err) {
        console.error("Error fetching stream:", err);
      }
    })();
  }, [id]);

  if (!video) return <p>Loading video...</p>;

  return (
    <div className="watch-page">
      <h2>{video.title}</h2>
      <p>{video.uploaderName}</p>
      {streamUrl ? (
        <video controls autoPlay src={streamUrl} poster={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} />
      ) : (
        <p>Loading stream...</p>
      )}
      <p>{video.views} views • Duration: {video.duration}s</p>
    </div>
  );
}
