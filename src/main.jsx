import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PlaylistProvider } from "./components/PlaylistContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/MyTube-Piped-Frontend/">
      <PlaylistProvider>
        <App />
      </PlaylistProvider>
    </BrowserRouter>
  </React.StrictMode>
);
