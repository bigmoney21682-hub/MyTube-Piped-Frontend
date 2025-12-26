// File: src/components/DebugOverlay.jsx
// PCC v13.3 — Lightweight global debug panel

import React, { useEffect, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function DebugOverlay() {
  const { currentVideo, playerMetrics } = usePlayer();

  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [apiKeyUsed, setApiKeyUsed] = useState("—");
  const [lastEndpoint, setLastEndpoint] = useState("—");
  const [apiCalls, setApiCalls] = useState(0);

  useEffect(() => {
    window.debugLog = (msg, category = "LOG") => {
      setLogs((prev) => [
        { msg, category, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 49),
      ]);
    };

    window.debugApi = (endpoint, key) => {
      setLastEndpoint(endpoint);
      setApiKeyUsed(key);
      setApiCalls((c) => c + 1);
      window.debugLog(`API → ${endpoint}`, "API");
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 60,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
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

      {visible && (
        <div
          style={{
            background: "rgba(0,0,0,0.85)",
            color: "#0f0",
            padding: 12,
            borderTop: "1px solid #333",
            maxHeight: "40vh",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: 12,
            pointerEvents: "auto",
          }}
        >
          <div><strong>Debug Panel</strong></div>

          <div>API Key Used: {apiKeyUsed}</div>
          <div>API Calls: {apiCalls}</div>
          <div>Last Endpoint: {lastEndpoint}</div>

          <div style={{ marginTop: 8 }}><strong>Player State</strong></div>
          <div>Video: {currentVideo?.id || "—"}</div>
          <div>State: {playerMetrics.state}</div>
          <div>
            Time: {playerMetrics.currentTime} / {playerMetrics.duration}
          </div>

          <div style={{ marginTop: 8 }}><strong>Logs</strong></div>
          {logs.map((l, i) => (
            <div key={i}>
              [{l.time}] [{l.category}] {l.msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
