// File: src/pages/Playlist.jsx
// FIXED: Reliable loading + debug logs + no stale state

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePlaylists } from "../contexts/PlaylistContext";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

export default function Playlist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { playlists } = usePlaylists();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug log helper
  const log = (msg) => window.debugLog?.(`Playlist(${id}): ${msg}`);

  useEffect(() => {
    log("Page mounted");
  }, []);

  useEffect(() => {
    log(`Playlists updated: count=${playlists.length}`);

    if (playlists.length === 0) {
      log("No playlists loaded yet, waiting...");
      return;
    }

    const found = playlists.find((p) => p.id === id);

    if (found) {
      log(`Playlist found: ${found.name}`);
      setPlaylist(found);
    } else {
      log("Playlist NOT found");
    }

    setLoading(false);
  }, [id, playlists]);

  if (loading) {
    return (
      <div style={{ paddingTop: "var(--header-height)" }}>
        <Header />
        <Spinner message="Loading playlist…" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div
        style={{
          paddingTop: "var(--header-height)",
          paddingBottom: "var(--footer-height)",
          color: "#fff",
        }}
      >
        <Header />
        <h3 style={{ padding: "1rem" }}>Playlist not found</h3>
      </div>
    );
  }

  const { name, videos = [] } = playlist;

  return (
    <div
      style={{
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--footer-height)",
        minHeight: "100vh",
        background: "var(--app-bg)",
        color: "#fff",
      }}
    >
      <Header />

      <h3 style={{ padding: "1rem" }}>
        📁 {name} ({videos.length})
      </h3>

      {videos.length === 0 ? (
        <p style={{ padding: "0 1rem", opacity: 0.7 }}>
          No videos in this playlist yet.
        </p>
      ) : (
        <div style={{ padding: "0 1rem" }}>
          {videos.map((v, i) => (
            <div
              key={v.id}
              style={{
                padding: 12,
                background: "#111",
                marginBottom: 8,
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/watch/${v.id}?pl=1&index=${i}`)}
            >
              {v.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
