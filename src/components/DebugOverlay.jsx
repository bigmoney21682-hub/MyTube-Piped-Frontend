// File: src/components/DebugOverlay.jsx
import { useEffect, useState } from "react";

const MAX_LOGS = 200;

export default function DebugOverlay({ pageName = "GLOBAL" }) {
  const [logs, setLogs] = useState([]);

  // Attach global logging function
  useEffect(() => {
    window.debugLog = (msg) => {
      setLogs((prev) => [...prev.slice(-MAX_LOGS + 1), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    // Initial log
    window.debugLog(`DEBUG: ${pageName} overlay initialized`);

    // Auto-log home screen boot if pageName is Home
    if (pageName === "Home") {
      window.debugLog("DEBUG: Home screen mounted");
      window.debugLog("DEBUG: Fetching trending videos...");
      // Optionally you can log other home events here automatically
    }

    return () => {
      window.debugLog = null;
    };
  }, [pageName]);

  const lineHeight = 18; // px
  const maxHeight = lineHeight * 4; // 4 lines

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
