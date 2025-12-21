// File: src/components/DebugOverlay.jsx
import { useEffect, useState } from "react";

const MAX_LOGS = 200;

export default function DebugOverlay({ pageName = "GLOBAL" }) {
  const [logs, setLogs] = useState([]);

  // Attach a global logging function
  useEffect(() => {
    window.debugLog = (msg) => {
      setLogs((prev) => [...prev.slice(-MAX_LOGS + 1), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    window.debugLog(`DEBUG: ${pageName} overlay initialized`);

    return () => {
      window.debugLog = null;
    };
  }, [pageName]);

  // Calculate height based on ~4 lines
  const lineHeight = 18; // px, adjust if needed
  const maxHeight = lineHeight * 4;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--footer-height)",
        left: 0,
        right: 0,
        maxHeight: maxHeight,
        background: "rgba(0,0,0,0.85)",
        color: "#0f0",
        fontSize: "0.8rem",
        overflowY: "auto",
        overflowX: "hidden",
        padding: 8,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            whiteSpace: "pre-wrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {log}
        </div>
      ))}
    </div>
  );
}
