// File: src/components/DebugOverlay.jsx
import { useEffect, useState } from "react";

// Global log queue
window.__debugQueue = window.__debugQueue || [];

export default function DebugOverlay() {
  const [logs, setLogs] = useState([]);

  // Push a log into the overlay
  const pushLog = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    pushLog("DEBUG: DebugOverlay mounted");

    // Expose global function for logging
    window.debugLog = (msg) => {
      pushLog(msg);
      window.__debugQueue.push(msg);
    };

    // Flush any logs in queue (from early calls)
    window.__debugQueue.forEach((msg) => pushLog(msg));
    window.__debugQueue = [];

    // Optional: Listen for global custom events (automatic)
    const listener = (e) => pushLog(e.detail);
    window.addEventListener("debug-log", listener);

    return () => window.removeEventListener("debug-log", listener);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--footer-height)",
        left: 0,
        right: 0,
        maxHeight: "30vh",
        overflowY: "auto",
        background: "rgba(0,0,0,0.85)",
        color: "#0f0",
        fontSize: "12px",
        padding: "4px 8px",
        zIndex: 2000,
        fontFamily: "monospace",
      }}
    >
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}
