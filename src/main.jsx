// File: src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./components/PlayerContext";

// ✅ Replace with your YouTube Data API v3 key
const YT_API_KEY = "YOUR_API_KEY_HERE";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <App apiKey={YT_API_KEY} />
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
