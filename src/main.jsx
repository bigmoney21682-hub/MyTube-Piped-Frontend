// File: src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PlayerProvider } from "./contexts/PlayerContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import { API_KEY } from "./config";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlaylistProvider>
      <PlayerProvider>
        <BrowserRouter>
          <App apiKey={API_KEY} />
        </BrowserRouter>
      </PlayerProvider>
    </PlaylistProvider>
  </React.StrictMode>
);
