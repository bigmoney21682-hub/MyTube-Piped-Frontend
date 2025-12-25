// File: src/main.jsx
// PCC v11.0 — Clean, crash‑proof main entry
// rebuild-main-11

// ------------------------------------------------------------
// Kill ALL service workers (safety for GitHub Pages)
// ------------------------------------------------------------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const reg of regs) reg.unregister();
  });
}

// ------------------------------------------------------------
// GLOBAL YT API KEY (runs before ANY imports)
// ------------------------------------------------------------
window.YT_API_KEY = import.meta.env.VITE_YT_API_PRIMARY;

// ------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------
import "./initApiKey";
import "./initDebug";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { PlayerProvider } from "./contexts/PlayerContext";

console.log("bundle rebuild", Date.now());

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

  window.__fatalErrors.push(entry);

  try {
    const existing = JSON.parse(localStorage.getItem("fatal_errors") || "[]");
    existing.push(entry);
    localStorage.setItem("fatal_errors", JSON.stringify(existing));
  } catch {}
}

window.onerror = function (msg, src, line, col, err) {
  persistError("window.onerror", msg, err?.stack || "");
};

window.onunhandledrejection = function (event) {
  persistError("unhandledrejection", event.reason, "");
};

// ------------------------------------------------------------
// SAFETY: Prevent React Router from booting with corrupted hash
// ------------------------------------------------------------
(function ensureCleanHash() {
  try {
    const h = window.location.hash || "";
    if (
      h.includes("undefined") ||
      h.includes("[object") ||
      h.endsWith("/watch/") ||
      h === "#/watch" ||
      h === "#/watch/"
    ) {
      console.warn("[main] Detected corrupted hash route, resetting to root");
      window.location.replace("#/");
    }
  } catch (err) {
    console.warn("[main] Hash safety check failed:", err);
  }
})();

// ------------------------------------------------------------
// ROOT MOUNT
// ------------------------------------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ErrorBoundary>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </ErrorBoundary>
    </HashRouter>
  </React.StrictMode>
);
