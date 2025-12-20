// File: src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./components/PlayerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </BrowserRouter>
);
