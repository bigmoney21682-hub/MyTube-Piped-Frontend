// File: src/components/Footer.jsx
// PCC v3.0 — Now Playing button wired to current video

import { useNavigate } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";

export default function Footer() {
  const navigate = useNavigate();
  const { currentVideo } = usePlayer();

  const hasVideo = !!currentVideo;
  const videoId =
    typeof currentVideo?.id === "string"
      ? currentVideo.id
      : currentVideo?.id?.videoId;

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--footer-height)",
        background: "var(--app-bg)",
        borderTop: "1px solid #222",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <FooterButton
        label="Playlists"
        icon="📁"
        onClick={() => navigate("/playlists")}
      />

      <FooterButton label="Home" icon="🏠" onClick={() => navigate("/")} />

      <FooterButton
        label="Now Playing"
        icon="🎵"
        disabled={!hasVideo}
        onClick={() => {
          if (!hasVideo) return;
          navigate(`/watch/${videoId}`);
        }}
      />
    </footer>
  );
}

function FooterButton({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: "none",
        color: "#fff",
        cursor: disabled ? "default" : "pointer",
        textAlign: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
    </button>
  );
}
