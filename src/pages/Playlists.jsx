/**
 * File: Playlists.jsx
 * Path: src/pages/Playlists.jsx
 * Description: Full playlist list page with debug logging,
 *              safe rendering, and navigation into Playlist.jsx.
 */

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext";
import { debugBus } from "../debug/debugBus.js";

const cardStyle = {
  background: "#111",
  borderRadius: "12px",
  padding: "16px",
  cursor: "pointer",
  border: "1px solid #222"
};

export default function Playlists() {
  const navigate = useNavigate();
  const { playlists, addPlaylist } = usePlaylists();

  const log = (msg) => debugBus.log("UI", `Playlists.jsx → ${msg}`);

  // Log mount
  useEffect(() => {
    log("Mounted");
  }, []);

  // Log playlist changes
  const prev = useRef([]);
  useEffect(() => {
    if (prev.current !== playlists) {
      log(`Playlists updated: count=${playlists?.length ?? 0}`);
      playlists?.forEach((p, i) => {
        log(
          `Playlist[${i}]: id=${p.id}, name="${p.name}", videos=${p.videos?.length ?? 0}`
        );
      });
      prev.current = playlists;
    }
  }, [playlists]);

  function handleAdd() {
    const name = prompt("Enter new playlist name:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const created = addPlaylist(trimmed);
    log(`Created playlist "${trimmed}" (id=${created.id})`);
  }

  function openPlaylist(id) {
    log(`Opening playlist id=${id}`);
    navigate(`/playlist/${id}`);
  }

  return (
    <div
      style={{
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--footer-height)",
        minHeight: "100vh",
        background: "var(--app-bg)",
        color: "#fff"
      }}
    >
      <div style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Playlists</h2>

        <button
          onClick={handleAdd}
          style={{
            background: "#ff0000",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14
          }}
        >
          + New Playlist
        </button>
      </div>

      {(!playlists || playlists.length === 0) ? (
        <p style={{ padding: "0 1rem", opacity: 0.7 }}>
          No playlists yet. Create one to get started.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
            padding: "1rem",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          {playlists.map((p) =>
            p ? (
              <div
                key={p.id}
                onClick={() => openPlaylist(p.id)}
                style={cardStyle}
              >
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    marginBottom: 6
                  }}
                >
                  📁 {p.name}
                </div>

                <div style={{ opacity: 0.6, fontSize: 13 }}>
                  {(p.videos?.length ?? 0)} video
                  {(p.videos?.length ?? 0) === 1 ? "" : "s"}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
