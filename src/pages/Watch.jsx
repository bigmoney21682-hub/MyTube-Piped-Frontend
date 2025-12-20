// File: src/pages/Watch.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePlayer } from "../components/PlayerContext";

// ⚡ Your public YouTube API key
const API_KEY = "YOUR_YOUTUBE_API_KEY";

export default function Watch() {
  const { id } = useParams();
  const { playVideo } = usePlayer();
  const [videoTitle, setVideoTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY}`
        );
        const data = await res.json();
        if (!data.items?.length) throw new Error("Video not found");

        const video = data.items[0];
        setVideoTitle(video.snippet?.title || "Untitled");

        playVideo({ id, title: video.snippet?.title });
      } catch (err) {
        console.error(err);
        setVideoTitle("Failed to load video");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, playVideo]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading video…</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>{videoTitle}</h2>
      <p style={{ opacity: 0.6 }}>Video ID: {id}</p>
    </div>
  );
}
