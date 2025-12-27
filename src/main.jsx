/**
 * File: main.jsx
 * Path: src/main.jsx
 * Description: React entry point with DebugOverlay v3 boot initialization.
 */

import React from "react";
import ReactDOM from "react-dom/client";

// Initialize global debug system BEFORE anything else
import "./debug/bootDebug";

// Global error listeners (safe in production)
window.addEventListener("error", (e) => {
  window.bootDebug?.error("GLOBAL ERROR → " + e.message);
});

window.addEventListener("unhandledrejection", (e) => {
  window.bootDebug?.error(
    "PROMISE REJECTION → " + (e.reason?.message || e.reason)
  );
});

// App root
import App from "./app/App";

function mount() {
  window.bootDebug?.boot("main.jsx → React root mounting");

  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  window.bootDebug?.boot("main.jsx → React root mounted");
}

mount();
