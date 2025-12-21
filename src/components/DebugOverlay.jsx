// File: src/components/DebugOverlay.jsx

import { useEffect, useState } from "react";

export default function DebugOverlay() {
  const [logs, setLogs] = useState([]);

  // Capture console messages
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      setLogs((prev) => [...prev, { type: "log", message: args.join(" ") }]);
      originalLog(...args);
    };
    console.error = (...args) => {
      setLogs((prev) => [...prev, { type: "error", message: args.join(" ") }]);
      originalError(...args);
    };
    console.warn = (...args) => {
      setLogs((prev) => [...prev, { type: "warn", message: args.join(" ") }]);
      originalWarn(...args);
    };

    // Capture global errors
    const handleError = (msg, url, line, col, error) => {
      setLogs((prev) => [
        ...prev,
        { type: "error", message: `${msg} at ${url}:${line}:${col}` },
      ]);
    };

    const handleRejection = (e) => {
      setLogs((prev) => [
        ...prev,
        { type: "error", message: `Unhandled promise rejection: ${e.reason}` },
      ]);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        maxHeight: "35vh",
        overflowY: "auto",
        background: "rgba(0,0,0,0.95)",
        color: "#fff",
        fontSize: "12px",
        padding: "4px 8px",
        zIndex: 99999,
      }}
    >
      <strong>DEBUG LOGS</strong>
      {logs.length === 0 && <div>Waiting for logs…</div>}
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            color:
              log.type === "error" ? "#ff5555" : log.type === "warn" ? "#ffdd55" : "#fff",
          }}
        >
          {log.message}
        </div>
      ))}
    </div>
  );
}
