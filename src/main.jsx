// File: src/main.jsx
// PCC v3.0 — Clean root + global error logging + API key init

window.__fatalErrors = window.__fatalErrors || [];

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
