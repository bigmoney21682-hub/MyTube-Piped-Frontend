/**
 * File: main.jsx
 * Path: src/main.jsx
 */

import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// ------------------------------------------------------------
// 1. Initialize debug system BEFORE anything else
// ------------------------------------------------------------
import "./debug/bootDebug.js";

// ------------------------------------------------------------
// 2. Install global loggers (Network, Player, etc.)
//    These MUST run before React mounts.
// ------------------------------------------------------------
import { installNetworkLogger } from "./debug/NetworkLogger.js";
import { installPlayerLogger } from "./debug/PlayerLogger.js";

installNetworkLogger();
installPlayerLogger();

// ------------------------------------------------------------
// 3. Global error listeners
// ------------------------------------------------------------
window.addEventListener("error", (e) => {
  window.bootDebug?.error("GLOBAL ERROR → " + e.message);
});

window.addEventListener("unhandledrejection", (e) => {
  window.bootDebug?.error(
    "PROMISE REJECTION → " + (e.reason?.message || e.reason)
  );
});

// ------------------------------------------------------------
// 4. App root
// ------------------------------------------------------------
import App from "./app/App.jsx";
import { PlayerProvider } from "./player/PlayerContext.jsx";

function mount() {
  window.bootDebug?.boot("main.jsx → React root mounting");

  const rootElement = document.getElementById("root");

  if (!rootElement) {
    window.bootDebug?.error("main.jsx → ERROR: #root not found in DOM");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <BrowserRouter>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </BrowserRouter>
    );

    window.bootDebug?.boot("main.jsx → React root mounted");
    window.bootDebug?.ready?.("main.jsx → app ready");
  } catch (err) {
    window.bootDebug?.error("main.jsx → React mount error: " + err?.message);
    throw err;
  }
}

mount();
