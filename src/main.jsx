// File: src/main.jsx
// PCC v3.0 — Clean root + global error logging + API key init

window.__fatalErrors = window.__fatalErrors || [];

// ------------------------------------------------------------
// GLOBAL CRASH LOGGER (PERSISTENT)
// ------------------------------------------------------------
window.__fatalErrors = window.__fatalErrors || [];

function persistError(type, message, extra) {
  const entry = {
    type,
    message: String(message),
    extra: extra ? String(extra) : "",
    time: new Date().toISOString(),
  };

  // Save to memory
  window.__fatalErrors.push(entry);

  // Save to localStorage (persists across reloads)
  try {
    const existing = JSON.parse(localStorage.getItem("fatal_errors") || "[]");
    existing.push(entry);
    localStorage.setItem("fatal_errors", JSON.stringify(existing));
  } catch {}
}

// Catch synchronous JS errors
window.onerror = function (msg, src, line, col, err) {
  persistError("window.onerror", msg, err?.stack || "");
};

// Catch async / promise errors
window.onunhandledrejection = function (event) {
  persistError("unhandledrejection", event.reason, "");
};


import "./initApiKey";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { PlayerProvider } from "./contexts/PlayerContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import "./index.css";

// ------------------------------------------------------------
// Global error logging (surfaced into DebugOverlay)
// ------------------------------------------------------------
window.onerror = function (message, source, lineno, colno, error) {
  window.debugLog?.(
    `GLOBAL ERROR: ${message} @ ${source}:${lineno}:${colno} :: ${
      error?.stack || "no stack"
    }`
  );
};

window.onunhandledrejection = function (event) {
  window.debugLog?.(
    `GLOBAL PROMISE REJECTION: ${
      event.reason?.message || event.reason || "no message"
    } :: ${event.reason?.stack || "no stack"}`
  );
};

// ------------------------------------------------------------
// React root
// ------------------------------------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <PlaylistProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </PlaylistProvider>
    </HashRouter>
  </React.StrictMode>
);
