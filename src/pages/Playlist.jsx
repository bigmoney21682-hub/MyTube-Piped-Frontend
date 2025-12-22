// File: src/pages/Playlist.jsx
// PCC v2.1 — Strong debug logging for playlist detail page

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

  const log = (msg) => window.debugLog?.(`Playlist(${id}): ${msg}`);

  // Page mount
  useEffect(() => {
    log("Mounted");
  }, []);

  // Playlist loading
  useEffect(() => {
    log(`Playlists updated: count=${playlists.length}`);

    if (playlists.length === 0) {
      log("No playlists loaded yet, waiting...");
      return;
    }

    const found = playlists.find((p) => p.id === id);

    if (found) {
      log(`Found playlist "${found.name}" with ${found.videos?.length ?? 0} videos`);
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
    log("Rendering: Playlist not found");
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

  log(`Rendering playlist "${name}" with ${videos.length} videos`);

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
              onClick={() => {
                log(`Clicked video index=${i}, id=${v.id}`);
                navigate(`/watch/${v.id}?pl=1&index=${i}`);
              }}
            >
              {v.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
