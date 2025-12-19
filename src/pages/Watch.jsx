// File: src/pages/Watch.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import Spinner from "../components/Spinner";

export default function Watch() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setError("");
      setVideoUrl("");

      try {
        /**
         * Backend contract:
         * GET /streams/:id
         * {
         *   title: string,
         *   videoStreams: [{ url, mimeType, quality }]
         * }
         */
        const res = await fetch(`${API_BASE}/streams/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.detail || "Failed to load stream");
        }

        setTitle(data.title || "Untitled");

        // Prefer first playable stream
        if (
          Array.isArray(data.videoStreams) &&
          data.videoStreams.length > 0 &&
          data.videoStreams[0].url
        ) {
          setVideoUrl(data.videoStreams[0].url);
        } else {
          throw new Error("No playable streams found");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Playback failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <Spinner message="Loading video…" />;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "#fff" }}>
        <h3>Playback error</h3>
        <p style={{ opacity: 0.8 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>{title}</h2>

      <video
        src={videoUrl}
        controls
        autoPlay
        playsInline
        style={{
          width: "100%",
          maxHeight: "70vh",
          background: "#000",
          borderRadius: 12,
        }}
      />

      <p style={{ marginTop: "0.5rem", opacity: 0.6 }}>
        Video ID: {id}
      </p>
    </div>
  );
}
