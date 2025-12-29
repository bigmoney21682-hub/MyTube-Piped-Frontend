/**
 * File: DebugOverlay.jsx
 * Path: src/debug/DebugOverlay.jsx
 * Description: Runtime debug overlay with channels (BOOT, PLAYER, ROUTER, NETWORK, PERF, CMD).
 *              Non-blocking: root uses pointerEvents: "none" so UI remains interactive.
 *              Panel positioned bottom-right; reopen button bottom-left.
 */

import React, { useEffect, useState } from "react";
import { debugBus } from "./debugBus.js";

const CHANNELS = ["BOOT", "PLAYER", "ROUTER", "NETWORK", "PERF", "CMD"];

export default function DebugOverlay() {
  const [visible, setVisible] = useState(true);
  const [activeChannel, setActiveChannel] = useState("PLAYER");
  const [logs, setLogs] = useState({
    BOOT: [],
    PLAYER: [],
    ROUTER: [],
    NETWORK: [],
    PERF: [],
    CMD: []
  });

  useEffect(() => {
    const unsub = debugBus.subscribe((channel, msg) => {
      setLogs((prev) => {
        if (!prev[channel]) return prev;
        const next = { ...prev };
        const list = next[channel].slice(-199);
        list.push(msg);
        next[channel] = list;
        return next;
      });
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  function handleCopy() {
    const text = logs[activeChannel].join("\n");
    navigator.clipboard.writeText(text);
    debugBus.info("DebugOverlay → Logs copied to clipboard");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: "none"
      }}
    >
      {/* Panel */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          width: "90%",
          maxWidth: 420,
          maxHeight: "70%",
          background: "rgba(0,0,0,0.9)",
          color: "#0f0",
          fontFamily: "monospace",
          fontSize: 11,
          border: "1px solid #333",
          borderRadius: 6,
          overflow: "hidden",
          display: visible ? "flex" : "none",
          flexDirection: "column",
          pointerEvents: "auto"
        }}
      >
        {/* Header / tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 6px",
            borderBottom: "1px solid #333",
            background: "#111"
          }}
        >
          <span style={{ marginRight: 8, fontWeight: "bold" }}>DEBUG</span>
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              style={{
                marginRight: 4,
                padding: "2px 6px",
                fontSize: 10,
                borderRadius: 4,
                border: "1px solid #444",
                background: activeChannel === ch ? "#0f0" : "transparent",
                color: activeChannel === ch ? "#000" : "#0f0",
                cursor: "pointer"
              }}
            >
              {ch}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          <button
            onClick={handleCopy}
            style={{
              marginRight: 4,
              padding: "2px 6px",
              fontSize: 10,
              borderRadius: 4,
              border: "1px solid #444",
              background: "transparent",
              color: "#0f0",
              cursor: "pointer"
            }}
          >
            Copy
          </button>
          <button
            onClick={() => setVisible(false)}
            style={{
              padding: "2px 6px",
              fontSize: 10,
              borderRadius: 4,
              border: "1px solid #444",
              background: "transparent",
              color: "#f44",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Log body */}
        <div
          style={{
            flex: 1,
            padding: "4px 6px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            minHeight: "120px"
          }}
        >
          {logs[activeChannel].map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Tiny reopen button (bottom-left) */}
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            padding: "4px 8px",
            fontSize: 10,
            borderRadius: 4,
            border: "1px solid #444",
            background: "rgba(0,0,0,0.8)",
            color: "#0f0",
            cursor: "pointer",
            pointerEvents: "auto"
          }}
        >
          DEBUG
        </button>
      )}
    </div>
  );
}
