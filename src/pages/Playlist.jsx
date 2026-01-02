/**
 * File: Playlist.jsx
 * Path: src/pages/Playlist.jsx
 * Description: Playlist page with video list, delete support,
 *              video count, and correct navigation to Watch.jsx.
 */

import React from "react";
import { Link, useParams } from "react-router-dom";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";
import VideoActions from "../components/VideoActions.jsx";

export default function Playlist() {
  const { id } = useParams();
  const { playlists, removeVideoFromPlaylist } = usePlaylists();

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div style={{ padding: 20, color: "#fff" }}>
        Playlist not found.
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      {/* Playlist title + video count */}
      <h2 style={{ marginBottom: "4px" }}>{playlist.name}</h2>
      <div style={{ opacity: 0.7, marginBottom: "16px" }}>
        {playlist.videos.length} videos
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {playlist.videos.map((v) => (
          <div key={v.id}>
            {/* Navigation includes src=playlist and playlist ID */}
            <Link
              to={`/watch/${v.id}?src=playlist&pl=${playlist.id}`}
              style={{
                textDecoration: "none",
                color: "#fff",
                display: "block"
              }}
            >
              <img
                src={v.thumbnail}
                alt={v.title}
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "8px"
                }}
              />

              <div
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginBottom: 4
                }}
              >
                {v.title}
              </div>

              <div
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                  marginBottom: 6
                }}
              >
                {v.author}
              </div>
            </Link>

            {/* Add to Queue / Playlist */}
            <VideoActions
              videoId={v.id}
              videoSnippet={{
                title: v.title,
                channelTitle: v.author,
                thumbnails: { medium: { url: v.thumbnail } }
              }}
            />

            {/* Delete button */}
            <button
              onClick={() => removeVideoFromPlaylist(playlist.id, v.id)}
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                background: "#400",
                color: "#fff",
                border: "1px solid #600",
                borderRadius: "4px",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              Remove from Playlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
