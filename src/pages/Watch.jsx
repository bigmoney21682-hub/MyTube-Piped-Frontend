// File: src/pages/Watch.jsx

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function Watch({ videos }) {
  const { id } = useParams();
  const { setSrc, setTitle, setAuthor, setPlaying } = usePlayer();

  useEffect(() => {
    if (!id) return;
    const video = videos?.find((v) => v.id === id);
    if (!video) return;

    setSrc(video.url || `https://www.youtube.com/watch?v=${video.id}`);
    setTitle(video.title);
    setAuthor(video.author);
    setPlaying(true);
  }, [id, videos, setSrc, setTitle, setAuthor, setPlaying]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>
        {videos?.find((v) => v.id === id)?.title || "Playing"}
      </h2>
      <p style={{ opacity: 0.6 }}>Video ID: {id}</p>
    </div>
  );
}
