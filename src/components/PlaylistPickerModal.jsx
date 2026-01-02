import React from "react";

export default function PlaylistPickerModal({ playlists, onSelect, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#111",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: "12px", color: "#fff" }}>
          Select Playlist
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {playlists.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                padding: "12px",
                background: "#222",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid #333",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>{p.name}</span>
              <span style={{ opacity: 0.7 }}>
                {p.videos?.length ?? 0}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "16px",
            width: "100%",
            padding: "10px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
