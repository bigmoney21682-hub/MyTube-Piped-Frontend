// File: src/components/DebugOverlay.jsx
// PCC v13.6 — Full-width, color-coded, scroll-only debug panel

import React, { useEffect, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function DebugOverlay() {
  const { currentVideo, playerMetrics } = usePlayer();

  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [apiKeyUsed, setApiKeyUsed] = useState("—");
  const [lastEndpoint, setLastEndpoint] = useState("—");
  const [apiCalls, setApiCalls] = useState(0);

  // ------------------------------------------------------------
  // Color map for categories
  // ------------------------------------------------------------
  const colorFor = (category) => {
    switch (category) {
      case "API":
        return "#4dd0e1"; // cyan
      case "ERROR":
        return "#ff5252"; // red
      case "HOME":
      case "WATCH":
      case "SEARCH":
      case "PLAYER":
        return "#ffeb3b"; // yellow
      default:
        return "#bdbdbd"; // gray
    }
  };

  // ------------------------------------------------------------
  // Global debug hooks
  // ------------------------------------------------------------
  useEffect(() => {
    window.debugLog = (msg, category = "LOG") => {
      setLogs((prev) => [
        { msg, category, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 49),
      ]);
    };

    window.debugApi = (endpoint, key) => {
      setLastEndpoint(endpoint);
      setApiKeyUsed(key ?? "null/undefined");
      setApiCalls((c) => c + 1);
      window.debugLog(`API → ${endpoint}`, "API");
    };
  }, []);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div
      style={{
        position: "fixed",
        bottom: 60,
        left: 0,
        right: 0,
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setVisible((v) => !v)}
        style={{
          position: "absolute",
          right: 16,
          bottom: -40,
          padding: "6px 12px",
          background: "#222",
          color: "#fff",
          border: "1px solid #444",
          borderRadius: 6,
          pointerEvents: "auto",
          fontSize: 12,
        }}
      >
        {visible ? "Hide Debug" : "Debug"}
      </button>

      {!visible ? null : (
        <div
          style={{
            background: "rgba(0,0,0,0.9)",
            color: "#0f0",
            padding: 12,
            borderTop: "1px solid #333",
            maxHeight: "45vh",
            overflowY: "auto",
            overflowX: "hidden",
            fontFamily: "monospace",
            fontSize: 12,
            pointerEvents: "auto",
            width: "100%",
            boxSizing: "border-box",
            wordBreak: "break-word",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>
            Debug Panel
          </div>

          {/* API summary */}
          <div>API Key Used: {apiKeyUsed}</div>
          <div>API Calls: {apiCalls}</div>
          <div style={{ wordBreak: "break-word" }}>
            Last Endpoint: {lastEndpoint}
          </div>

          {/* Player state */}
          <div style={{ marginTop: 8, fontWeight: "bold" }}>
            Player State
          </div>
          <div>Video: {currentVideo?.id || "—"}</div>
          <div>State: {playerMetrics.state}</div>
          <div>
            Time: {playerMetrics.currentTime} / {playerMetrics.duration}
          </div>

          {/* Logs */}
          <div style={{ marginTop: 8, fontWeight: "bold" }}>Logs</div>

          {logs.map((l, i) => (
            <div
              key={i}
              style={{
                color: colorFor(l.category),
                marginBottom: 2,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              [{l.time}] [{l.category}] {l.msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
