/**
 * File: DebugOverlay.jsx
 * Path: src/debug/DebugOverlay.jsx
 * Description: Main container for the v3 Debug Overlay.
 * Delegates header + inspector rendering to modular components.
 */

import React, { useEffect, useState } from "react";
import { debugBus } from "./debugBus.js";

import DebugHeader from "./DebugHeader.jsx";
import DebugContent from "./DebugContent.jsx";

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

  // Subscribe to debugBus
  useEffect(() => {
    const unsub = debugBus.subscribe((level, entry) => {
      setLogs((prev) => {
        if (!prev[level]) return prev;
        const next = { ...prev };
        const list = next[level].slice(-199);
        list.push(entry);
        next[level] = list;
        return next;
      });
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

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
          height: "30%",
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
        <DebugHeader
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          logs={logs}
          visible={visible}
          setVisible={setVisible}
        />

        <DebugContent
          activeChannel={activeChannel}
          logs={logs}
        />
      </div>

      {/* Reopen button */}
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
