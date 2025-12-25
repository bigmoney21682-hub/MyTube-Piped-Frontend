// File: src/App.jsx
// PCC v1.0 — Minimal sanity shell to prove React is alive

import React from "react";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        color: "#0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 8 }}>MyTube Boot Check</div>
      <div style={{ fontSize: 14, opacity: 0.8 }}>
        If you see this, React + Vite + Pages are all wired correctly.
      </div>
    </div>
  );
}

export default App;
