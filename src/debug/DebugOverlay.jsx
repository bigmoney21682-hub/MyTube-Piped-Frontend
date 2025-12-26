// src/debug/DebugOverlay.jsx
import { useEffect, useState } from "react";
import { subscribeDebug } from "./debugBus";

export default function DebugOverlay() {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    return subscribeDebug(entry => {
      setLogs(prev => [entry, ...prev].slice(0, 200));
    });
  }, []);

  if (!open) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          background: "#111",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 6,
          fontSize: 12,
          opacity: 0.8,
          zIndex: 99999
        }}
        onClick={() => setOpen(true)}
      >
        Debug
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        width: "90%",
        maxWidth: 400,
        height: "50%",
        background: "#000",
        color: "#0f0",
        padding: 10,
        overflowY: "auto",
        borderRadius: 8,
        zIndex: 99999,
        opacity: 0.9,
        fontSize: 12
      }}
    >
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <strong>Debug Console</strong>
        <button
          style={{
            background: "#222",
            color: "#fff",
            border: "none",
            padding: "4px 8px",
            borderRadius: 4
          }}
          onClick={() => setOpen(false)}
        >
          Minimize
        </button>
      </div>

      {logs.map(log => (
        <div key={log.id} style={{ marginBottom: 6 }}>
          <span style={{ color: "#888" }}>
            [{log.type}] {log.timestamp}
          </span>
          <br />
          {log.message}
        </div>
      ))}
    </div>
  );
}
