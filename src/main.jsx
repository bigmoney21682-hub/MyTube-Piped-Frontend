// File: src/main.jsx
// Root entry point — initializes debug + API keys BEFORE React mounts.

import "./initDebug";      // must load first (global debug hooks)
import "./initApiKey";     // safe: only loads env keys, never throws

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";      // global styles

// Optional sanity log to confirm boot sequence
console.log("MAIN: React bundle loaded");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
