import React, { useState } from "react";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";
import { usePlayer } from "../player/PlayerContext.jsx";
import PlaylistPickerModal from "./PlaylistPickerModal.jsx";

export default function VideoActions({ videoId, videoSnippet }) {
  const { playlists, addVideoToPlaylist } = usePlaylists();
  const player = usePlayer();
  const queueAdd = player?.queueAdd ?? (() => {});

  const [showPicker, setShowPicker] = useState(false);

  function handleAddToPlaylist() {
    if (!playlists || playlists.length === 0) {
      alert("You have no playlists yet. Create one first.");
      return;
    }
    setShowPicker(true);
  }

  return (
    <>
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <button
          onClick={() => queueAdd(videoId)}
          style={{
            padding: "8px 12px",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "4px",
            fontSize: "13px"
          }}
        >
          + Add to Queue
        </button>

        <button
          onClick={handleAddToPlaylist}
          style={{
            padding: "8px 12px",
            background: "#222",
            color: "#3ea6ff",
            border: "1px solid #444",
            borderRadius: "4px",
            fontSize: "13px"
          }}
        >
          + Playlist
        </button>
      </div>

      {showPicker && (
        <PlaylistPickerModal
          playlists={playlists}
          onSelect={(playlist) => {
            addVideoToPlaylist(playlist.id, {
              id: videoId,
              title: videoSnippet?.title ?? "Untitled",
              author: videoSnippet?.channelTitle ?? "Unknown Channel",
              thumbnail: videoSnippet?.thumbnails?.medium?.url ?? ""
            });

            setShowPicker(false);
            alert(`Added to playlist: ${playlist.name}`);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
