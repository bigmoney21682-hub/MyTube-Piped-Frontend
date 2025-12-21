import { usePlaylists } from "../contexts/PlaylistContext";

export default function PlaylistPicker({ video, onClose }) {
  const { playlists, addPlaylist, addToPlaylist } = usePlaylists();

  const handleAddTo = (playlistId) => {
    addToPlaylist(playlistId, video);
    onClose();
  };

  const handleCreate = () => {
    const name = prompt("New playlist name:");
    if (!name) return;
    addPlaylist(name);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111",
          padding: 20,
          borderRadius: 12,
          width: "90%",
          maxWidth: 360,
          color: "#fff",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Add to Playlist</h3>

        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          {playlists.map((p) => (
            <div
              key={p.id}
              onClick={() => handleAddTo(p.id)}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #333",
                cursor: "pointer",
              }}
            >
              📁 {p.name}
            </div>
          ))}
        </div>

        <button
          onClick={handleCreate}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 10,
            background: "#ff0000",
            border: "none",
            color: "#fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          + New Playlist
        </button>
      </div>
    </div>
  );
}
