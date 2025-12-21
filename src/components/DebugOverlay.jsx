// File: src/components/DebugOverlay.jsx
import { useEffect, useState } from "react";

const MAX_LOGS = 200;

export default function DebugOverlay({ pageName = "GLOBAL" }) {
  const [logs, setLogs] = useState([]);

  // Attach a global function to allow other components to log
  useEffect(() => {
    window.debugLog = (msg) => {
      setLogs((prev) => [...prev.slice(-MAX_LOGS + 1), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    window.debugLog(`DEBUG: ${pageName} overlay initialized`);

    return () => {
      window.debugLog = null;
    };
  }, [pageName]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--footer-height)",
        left: 0,
        right: 0,
        maxHeight: "40vh",
        background: "rgba(0,0,0,0.85)",
        color: "#0f0",
        fontSize: "0.8rem",
        overflowY: "auto",
        padding: 8,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {logs.map((log, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap" }}>
          {log}
        </div>
      ))}
    </div>
  );
}
