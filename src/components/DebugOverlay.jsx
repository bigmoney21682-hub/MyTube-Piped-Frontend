// File: src/components/DebugOverlay.jsx
// PCC v3.8 — zIndex fix so overlay appears above BootJosh

import { useEffect, useRef, useState } from "react";

const MAX_LOGS = 300;
const VISIBLE_LINES = 6;

export default function DebugOverlay({ pageName, sourceUsed }) {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  // Initialize global debugLog()
  useEffect(() => {
    window.debugLog = (msg) => {
      const timestamp = new Date().toLocaleTimeString();
      const line = `${timestamp}: ${msg}`;
      setLogs((prev) => [...prev.slice(-MAX_LOGS + 1), line]);
    };

    window.debugLog("DEBUG: DebugOverlay initialized");
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => setLogs([]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        bottom: "var(--footer-height)", // sits above footer
        left: 0,
        right: 0,

        height: `${(VISIBLE_LINES * 0.6) * 1.4}em`, // compact height

        background: "rgba(0,0,0,0.9)",
        color: "#0f0",
        fontSize: "0.8rem",
        overflowY: "auto",
        padding: "6px 8px 4px 8px",

        // ⭐ FIX: ensure overlay is above BootJosh
        zIndex: 9999999,

        borderTop: "1px solid #333",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          opacity: 0.85,
        }}
      >
        <div>
          Page: {pageName}
          {sourceUsed && (
            <span
              style={{
                marginLeft: 8,
                padding: "1px 4px",
                borderRadius: 4,
                background:
                  sourceUsed === "INVIDIOUS"
                    ? "#2196f3"
                    : sourceUsed === "YOUTUBE_API"
                    ? "#ff9800"
                    : "#555",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            >
              [{sourceUsed}]
            </span>
          )}
        </div>

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
