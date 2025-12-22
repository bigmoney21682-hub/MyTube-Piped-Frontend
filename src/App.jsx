// File: src/App.jsx
// PCC v3.0 — Stable global player state, miniplayer activation, playlist routing, search, debug logging

import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Playlist from "./pages/Playlist";
import SettingsPage from "./pages/SettingsPage";
import Watch from "./pages/Watch";

import BootSplash from "./components/BootSplash";
import Footer from "./components/Footer";
import DebugOverlay from "./components/DebugOverlay";
import Header from "./components/Header";
import MiniPlayer from "./components/MiniPlayer";

import { PlaylistProvider } from "./contexts/PlaylistContext";
import { clearAllCaches } from "./utils/cacheManager";

export default function App() {
  const [ready, setReady] = useState(false);

  // Global player state (shared across pages)
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Global search state
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Debug helpers
  const log = (msg) => window.debugLog?.(`App: ${msg}`);

  // Track global player state changes
  useEffect(() => {
    if (!currentVideo) {
      log("currentVideo changed -> null");
    } else {
      log(
        `currentVideo changed -> id=${currentVideo.id || currentVideo.videoId || "unknown"}`
      );
    }
  }, [currentVideo]);

  useEffect(() => {
    log(`isPlaying changed -> ${isPlaying}`);
  }, [isPlaying]);

  // Initial splash + optional cache clear
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);

    const autoClear = localStorage.getItem("autoClearCache") === "true";
    if (autoClear) {
      log("Auto-clearing caches");
      clearAllCaches();
    }

    return () => clearTimeout(t);
  }, []);

  // Search handler
  const handleSearch = (query) => {
    log(`Search requested: ${query}`);
    setSearchQuery(query);
    navigate("/"); // always show results on Home page
  };

  // Play video from anywhere in the app
  const playVideo = (video) => {
    log(`playVideo called for id=${video.id}`);
    setCurrentVideo(video);
    setIsPlaying(true);
    navigate(`/watch/${video.id}`);
  };

  const togglePlay = () => {
    log(`togglePlay -> ${!isPlaying}`);
    setIsPlaying(!isPlaying);
  };

  const closePlayer = () => {
    log("closePlayer -> clearing currentVideo");
    setCurrentVideo(null);
    setIsPlaying(false);
  };

  return (
    <PlaylistProvider>
      <BootSplash ready={ready} />

      {ready && (
        <>
          <Header onSearch={handleSearch} />
          <DebugOverlay pageName="App" />

          <div
            style={{
              paddingBottom: currentVideo ? "68px" : "var(--footer-height)",
            }}
          >
            <Routes>
              <Route
                path="/"
                element={<Home searchQuery={searchQuery} />}
              />

              <Route path="/playlists" element={<Playlists />} />

              <Route path="/playlist/:id" element={<Playlist />} />

              <Route
                path="/watch/:id"
                element={
                  <Watch
                    currentVideo={currentVideo}
                    setCurrentVideo={setCurrentVideo}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                  />
                }
              />

              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>

          <Footer />

          {/* Persistent MiniPlayer – enables background play */}
          <MiniPlayer
            currentVideo={currentVideo}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onClose={closePlayer}
          />
        </>
      )}
    </PlaylistProvider>
  );
}
