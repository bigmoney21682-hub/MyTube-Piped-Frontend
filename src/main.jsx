// File: src/main.jsx
// PCC v2.0 — Stable React entrypoint

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element #root not found in index.html");
} else {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
