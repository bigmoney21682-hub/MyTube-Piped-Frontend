// File: src/components/DebugOverlay.jsx
// PCC v3.0 — Stacked above miniplayer, auto-scrolling, clearable

import { useEffect, useRef, useState } from "react";

const MAX_LOGS = 300;
const VISIBLE_LINES = 6;

export default function DebugOverlay({ pageName }) {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  // Install global logger ONCE
  useEffect(() => {
    window.debugLog = (msg) => {
      const timestamp = new Date().toLocaleTimeString();
      const line = `${timestamp}: ${msg}`;

      setLogs((prev) => {
        const updated = [...prev.slice(-MAX_LOGS + 1), line];
        return updated;
      });
    };

    window.debugLog("DEBUG: DebugOverlay initialized");
  }, []);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
    window.debugLog("DEBUG: Logs cleared");
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        // IMPORTANT: sit ABOVE miniplayer, which is above footer
        // Footer: bottom: 0, height: var(--footer-height)
        // MiniPlayer: bottom: var(--footer-height), height: 68px
        // DebugOverlay: above both
        bottom: "calc(var(--footer-height) + 68px)",
        left: 0,
        right: 0,
        height: `${VISIBLE_LINES * 1.4}em`,
        background: "rgba(0,0,0,0.9)",
        color: "#0f0",
        fontSize: "0.8rem",
        overflowY: "auto",
        padding: "4px 8px",
        zIndex: 9999, // stays on top visually, but now *above* miniplayer
        pointerEvents: "auto",
        userSelect: "text",
        borderTop: "1px solid #333",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          opacity: 0.8,
        }}
      >
        <div>{pageName ? `Page: ${pageName}` : "Debug Console"}</div>

        <button
          onClick={clearLogs}
          style={{
            background: "none",
            border: "1px solid #0f0",
            color: "#0f0",
            padding: "0 6px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: "0.7rem",
          }}
        >
          Clear
        </button>
      </div>

      {/* Log lines */}
      {logs.map((log, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap", lineHeight: "1.4em" }}>
          {log}
        </div>
      ))}
    </div>
  );
}
