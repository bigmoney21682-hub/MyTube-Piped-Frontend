// File: src/components/DebugOverlay.jsx
// PCC v3.3 — Mobile-visible by default, desktop-toggle, scroll area, [SOURCE] tag

import { useEffect, useState } from "react";

export default function DebugOverlay({ pageName, sourceUsed }) {
  // Mobile Safari cannot toggle with keyboard -> default ON for mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const [visible, setVisible] = useState(isMobile ? true : false);

  // Desktop toggle with backtick
  useEffect(() => {
    if (isMobile) return; // mobile cannot toggle
    const handler = (e) => {
      if (e.key === "`") {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobile]);

  const tagStyle = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    marginLeft: 6,
  };

  const sourceColor =
    sourceUsed === "INVIDIOUS"
      ? "#2196f3"
      : sourceUsed === "YOUTUBE_API"
      ? "#ff9800"
      : "#777";

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.85)",
        padding: 12,
        borderRadius: 8,
        color: "#fff",
        fontSize: 13,
        zIndex: 9999,
        maxWidth: 260,
        lineHeight: 1.4,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        Debug: {pageName}
      </div>

      {sourceUsed && (
        <div style={{ marginBottom: 8 }}>
          Source:
          <span style={{ ...tagStyle, background: sourceColor }}>
            [{sourceUsed}]
          </span>
        </div>
      )}

      <div
        style={{
          maxHeight: 160,
          overflowY: "auto",
          paddingRight: 4,
          opacity: 0.9,
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Debug info will appear here as you extend this overlay.
        </div>
      </div>
    </div>
  );
}
