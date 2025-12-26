/**
 * File: DebugCommandBar.jsx
 * Path: src/debug/DebugCommandBar.jsx
 * Description: Command input console for DebugOverlay v3.
 * Allows running simple debug commands and logs results.
 */

import { useState } from "react";

export default function DebugCommandBar({ onCommand }) {
  const [input, setInput] = useState("");

  function runCommand() {
    const cmd = input.trim();
    if (!cmd) return;

    // Log the command itself
    onCommand({
      level: "CMD",
      msg: "> " + cmd,
      ts: Date.now()
    });

    try {
      // Built‑in commands
      if (cmd === "clear") {
        onCommand({
          level: "INFO",
          msg: "Console cleared",
          ts: Date.now()
        });
        window.location.reload();
        return;
      }

      if (cmd === "reload") {
        window.location.reload();
        return;
      }

      // Evaluate JS safely
      const result = eval(cmd);

      onCommand({
        level: "INFO",
        msg: "Result: " + JSON.stringify(result),
        ts: Date.now()
      });
    } catch (err) {
      onCommand({
        level: "ERROR",
        msg: "Error: " + err.message,
        ts: Date.now()
      });
    }

    setInput("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
        whiteSpace: "normal",
        wordBreak: "break-word",
        minWidth: 0
      }}
    >
      <div style={{ color: "#ccc", fontSize: 12 }}>
        Type a JavaScript command and press Enter.
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") runCommand();
        }}
        placeholder="> command"
        style={{
          width: "100%",
          padding: "6px 8px",
          background: "#111",
          border: "1px solid #444",
          color: "#fff",
          borderRadius: 4,
          fontFamily: "monospace",
          fontSize: 12,
          boxSizing: "border-box",
          minWidth: 0
        }}
      />
    </div>
  );
}
