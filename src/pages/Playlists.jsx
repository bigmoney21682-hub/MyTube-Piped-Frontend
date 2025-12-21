// File: src/pages/Playlists.jsx
import { useEffect } from "react";
import { usePlaylists } from "../contexts/PlaylistContext";
import Header from "../components/Header";

export default function Playlists() {
  const { playlists, addPlaylist } = usePlaylists();

  useEffect(() => {
    window.debugLog?.("DEBUG: Playlists page mounted");
    window.debugLog?.(`DEBUG: Playlists count = ${playlists.length}`);
  }, [playlists.length]);

  const handleAdd = () => {
    const name = prompt("Enter new playlist name:");
    if (name) {
      addPlaylist(name);
      window.debugLog?.(`DEBUG: Playlist created: "${name}"`);
    }
  };

  return (
    <div
      style={{
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--footer-height)",
        minHeight: "100vh",
      }}
    >
      <Header />

      <h2 style={{ padding: "1rem" }}>Playlists</h2>

      <button style={{ marginLeft: "1rem" }} onClick={handleAdd}>
        + New Playlist
      </button>

      <ul style={{ padding: "1rem" }}>
        {playlists.map((p) => (
          <li key={p.id}>
            {p.name} ({p.videos.length})
          </li>
        ))}
      </ul>
    </div>
  );
}
