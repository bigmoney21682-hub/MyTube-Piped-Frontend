// File: src/pages/DebugEnv.jsx
// PCC v1.0 — Full environment inspector for Vite + GitHub Pages.
// Prints all import.meta.env values so you can confirm API key injection.

import React from "react";

export default function DebugEnv() {
  const env = import.meta.env;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "monospace",
        background: "#111",
        color: "#0f0",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>
        DebugEnv — Vite Environment Inspector
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <strong style={{ color: "#fff" }}>VITE_YT_API_PRIMARY:</strong>
        <div style={{ wordBreak: "break-all" }}>
          {env.VITE_YT_API_PRIMARY || "undefined"}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong style={{ color: "#fff" }}>VITE_YT_API_FALLBACK1:</strong>
        <div style={{ wordBreak: "break-all" }}>
          {env.VITE_YT_API_FALLBACK1 || "undefined"}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong style={{ color: "#fff" }}>Full import.meta.env:</strong>
        <pre
          style={{
            background: "#000",
            padding: "12px",
            border: "1px solid #333",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
{JSON.stringify(env, null, 2)}
        </pre>
      </div>
    </div>
  );
}
