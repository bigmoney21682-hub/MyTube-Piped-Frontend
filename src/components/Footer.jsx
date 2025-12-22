// File: src/components/Footer.jsx
// PCC v1.1 — Adds debug instrumentation to diagnose visibility issues

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [debugInfo, setDebugInfo] = useState("");

  // Debug: track footer geometry
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const info = `Footer: top=${rect.top.toFixed(0)}, bottom=${rect.bottom.toFixed(
        0
      )}, height=${rect.height.toFixed(0)}, z=${getComputedStyle(
        ref.current
      ).zIndex}`;

      setDebugInfo(info);
      window.debugLog?.(info);
    };

    update();
    const interval = setInterval(update, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Debug box */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          background: "rgba(255,0,0,0.8)",
          padding: "4px 8px",
          fontSize: 10,
          zIndex: 999999,
          pointerEvents: "none",
        }}
      >
        {debugInfo}
      </div>

      {/* Actual footer */}
      <footer
        ref={ref}
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
        <FooterButton label="Now Playing" icon="🎵" disabled />
      </footer>
    </>
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
