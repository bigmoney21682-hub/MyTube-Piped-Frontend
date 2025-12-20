// File Identity Lock: DebugOverlay.jsx
import { useEffect, useState } from "react";

export default function DebugOverlay() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Global error handler
    window.onerror = (msg, url, line, col, error) => {
      setLogs((prev) => [
        { type: "error", text: `${msg} at ${line}:${col}`, timestamp: new Date().toLocaleTimeString() },
        ...prev,
      ]);
      console.log("Global error:", { msg, url, line, col, error });
    };

    // Unhandled promise rejection
    window.onunhandledrejection = (e) => {
      setLogs((prev) => [
        { type: "promise", text: e.reason?.toString() || "Unhandled rejection", timestamp: new Date().toLocaleTimeString() },
        ...prev,
      ]);
      console.log("Unhandled promise rejection:", e.reason);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "40%",
        overflowY: "auto",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        fontSize: 12,
        fontFamily: "monospace",
        zIndex: 9999,
        padding: 8,
      }}
    >
      {logs.map((log, idx) => (
        <div key={idx} style={{ marginBottom: 4, color: log.type === "error" ? "#f88" : "#8f8" }}>
          [{log.timestamp}] {log.text}
        </div>
      ))}
    </div>
  );
}
