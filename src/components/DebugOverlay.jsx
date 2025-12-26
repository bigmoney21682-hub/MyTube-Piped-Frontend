// File: src/components/DebugOverlay.jsx
// PCC v13.7 — TEST MODE (always visible, top layer, bright)

import React, { useEffect, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function DebugOverlay() {
  const { currentVideo, playerMetrics } = usePlayer();

  const [logs, setLogs] = useState([]);
  const [apiKeyUsed, setApiKeyUsed] = useState("—");
  const [lastEndpoint, setLastEndpoint] = useState("—");
  const [apiCalls, setApiCalls] = useState(0);

  // Log mount event
  useEffect(() => {
    console.log("DEBUG OVERLAY MOUNTED (TEST MODE)");
  }, []);

  // Color map
  const colorFor = (category) => {
    switch (category) {
      case "API":
        return "#4dd0e1";
      case "ERROR":
        return "#ff5252";
      case "HOME":
      case "WATCH":
      case "SEARCH":
      case "PLAYER":
        return "#ffeb3b";
      default:
        return "#bdbdbd";
    }
  };

  // Global hooks
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

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        maxWidth: "100%",
        background: "rgba(0,0,0,0.95)",
        color: "#0f0",
        padding: 12,
        borderTop: "3px solid #ff00ff",
        maxHeight: "50vh",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "monospace",
        fontSize: 12,
        pointerEvents: "auto",
        boxSizing: "border-box",
        wordBreak: "break-word",
        zIndex: 9999999, // ← TOP OF THE ENTIRE APP
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: "bold", color: "#ff00ff" }}>
        DEBUG OVERLAY — TEST MODE (ALWAYS VISIBLE)
      </div>

      <div>API Key Used: {apiKeyUsed}</div>
      <div>API Calls: {apiCalls}</div>
      <div>Last Endpoint: {lastEndpoint}</div>

      <div style={{ marginTop: 8, fontWeight: "bold" }}>Player State</div>
      <div>Video: {currentVideo?.id || "—"}</div>
      <div>State: {playerMetrics.state}</div>
      <div>
        Time: {playerMetrics.currentTime} / {playerMetrics.duration}
      </div>

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
  );
}
