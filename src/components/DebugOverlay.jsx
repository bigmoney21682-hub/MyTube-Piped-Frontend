// File: src/components/DebugOverlay.jsx
// PCC v5.0 — Inline debug panel (non-floating) placed in content flow above footer.
// Tracks API key usage, endpoints, player state, video ID, and global logs.

import React, { useEffect, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function DebugOverlay() {
  const { current, playerState } = usePlayer();

  const [logs, setLogs] = useState([]);
  const [apiKeyUsed, setApiKeyUsed] = useState(null);
  const [lastEndpoint, setLastEndpoint] = useState(null);
  const [apiCallCount, setApiCallCount] = useState(0);

  // Hook into global debugLog()
  useEffect(() => {
    window.debugLog = (msg) => {
      setLogs((prev) => [...prev.slice(-40), msg]); // keep last 40 logs

      // Detect key usage
      if (msg.startsWith("API KEY USED")) {
        const key = msg.split("→")[1]?.trim();
        setApiKeyUsed(key);
        setApiCallCount((c) => c + 1);
      }

      // Detect endpoint
      if (msg.startsWith("URL")) {
        const url = msg.split("→")[1]?.trim();
        setLastEndpoint(url);
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(0,0,0,0.85)",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: 12,
        padding: "12px 16px",
        borderTop: "1px solid #333",
        borderBottom: "1px solid #333",
        boxSizing: "border-box",
        marginTop: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong style={{ color: "#fff" }}>Debug Panel</strong>
      </div>

      {/* Key Info */}
      <div style={{ marginBottom: 8 }}>
        <div>
          API Key Used: <span style={{ color: "#fff" }}>{apiKeyUsed || "—"}</span>
        </div>
        <div>
          API Calls: <span style={{ color: "#fff" }}>{apiCallCount}</span>
        </div>
        <div style={{ marginTop: 4 }}>
          Last Endpoint:
          <div style={{ color: "#fff", fontSize: 11, wordBreak: "break-all" }}>
            {lastEndpoint || "—"}
          </div>
        </div>
      </div>

      {/* Player Info */}
      <div style={{ marginBottom: 8 }}>
        <div>
          Player State: <span style={{ color: "#fff" }}>{playerState}</span>
        </div>
        <div>
          Current Video:{" "}
          <span style={{ color: "#fff" }}>{current?.id || "—"}</span>
        </div>
      </div>

      {/* Log Stream */}
      <div style={{ borderTop: "1px solid #333", paddingTop: 8 }}>
        {logs.map((l, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
