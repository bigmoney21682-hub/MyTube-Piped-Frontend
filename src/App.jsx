// File: src/App.jsx
// Stable app shell with router logging + global components

import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Watch from "./pages/Watch";
import SearchResults from "./pages/SearchResults";
import Playlist from "./pages/Playlist";
import Playlists from "./pages/Playlists";
import Subscriptions from "./pages/Subscriptions";
import ChannelPage from "./pages/ChannelPage";
import SettingsPage from "./pages/SettingsPage";
import DebugEnv from "./pages/DebugEnv";

import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalPlayer from "./components/GlobalPlayer";
import MiniPlayer from "./components/MiniPlayer";
import DebugOverlay from "./components/DebugOverlay";

import { debugRouter } from "./utils/debug";

export default function App() {
  const location = useLocation();

  // Log every route change
  useEffect(() => {
    const path = location.pathname + location.search;
    debugRouter(`ROUTE → ${path}`);
  }, [location]);

  // Log initial mount
  useEffect(() => {
    debugRouter("App mounted");
  }, []);

  return (
    <div className="app-shell">
      {/* Global UI */}
      <Header />
      <GlobalPlayer />
      <MiniPlayer />
      <DebugOverlay />

      {/* Routed content */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/debug" element={<DebugEnv />} />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div style={{ color: "#fff", padding: 20 }}>
                Page not found
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
