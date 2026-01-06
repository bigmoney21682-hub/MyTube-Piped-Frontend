/**
 * File: main.jsx
 * Path: src/main.jsx
 * Description:
 *   Root entry for the React app.
 *   Wraps App with:
 *     - HashRouter (GitHub Pages compatible)
 *     - PlaylistProvider
 *     - PlayerProvider
 *
 *   Notes:
 *     - React.StrictMode removed (breaks YouTube iframe)
 *     - DebugOverlay removed (causes DOM mutation + iframe removal)
 */

// ------------------------------------------------------------
// 🔥 Global Debug Listeners
// ------------------------------------------------------------
window.addEventListener("error", (e) => {
  console.group("[GLOBAL ERROR]");
  console.log("Message:", e.message);
  console.log("File:", e.filename);
  console.log("Line:", e.lineno);
  console.log("Column:", e.colno);
  console.log("Error object:", e.error);
  console.groupEnd();
});

window.addEventListener("unhandledrejection", (e) => {
  console.group("[UNHANDLED PROMISE]");
  console.log("Reason:", e.reason);
  console.log("Stack:", e.reason?.stack);
  console.groupEnd();
});

// ------------------------------------------------------------
// ⭐ Critical: ensures GlobalPlayerFix.js executes BEFORE React
// ------------------------------------------------------------
import "./player/GlobalPlayerFix.js";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./app/App.jsx";
import { PlaylistProvider } from "./contexts/PlaylistContext.jsx";
import { PlayerProvider } from "./player/PlayerContext.jsx";

import "./index.css";

// ------------------------------------------------------------
// 🚀 Create root + render (NO StrictMode, NO DebugOverlay)
// ------------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
    <PlaylistProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </PlaylistProvider>
  </HashRouter>
);
