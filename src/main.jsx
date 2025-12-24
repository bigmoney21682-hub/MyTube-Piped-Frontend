// File: src/main.jsx
// PCC v5.0 — HashRouter + Global crash logger + ErrorBoundary wrapper

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HashRouter>
  </React.StrictMode>
);
