/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description:
 *   Layout controller.
 *   - Header at top
 *   - Player area (iframe or FullPlayer)
 *   - MiniPlayer only when collapsed
 *   - Content below
 *   - Footer at bottom
 *   - No sticky/pinning for now (all scroll together)
 */

import React, { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../layout/Footer.jsx";

import MiniPlayer from "../player/MiniPlayer.jsx";
import FullPlayer from "../player/FullPlayer.jsx";

import { PlayerContext } from "../player/PlayerContext.jsx";

import Home from "../pages/Home/Home.jsx";
import Playlists from "../pages/Playlists.jsx";
import Search from "../pages/Search.jsx";

export default function App() {
  const [expanded, setExpanded] = useState(false);
  const { currentId } = useContext(PlayerContext);

  // Auto-expand when a video starts
  useEffect(() => {
    if (currentId) {
      setExpanded(true);
    }
  }, [currentId]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#000",
        color: "#fff",
        overflowX: "hidden"
      }}
    >
      <Header />

      {/* Player area (no sticky for now) */}
      <div
        style={{
          width: "100%",
          height: 220,
          background: "#000"
        }}
      >
        {!expanded && (
          <div
            id="yt-player"
            style={{
              width: "100%",
              height: "100%",
              background: "#000"
            }}
          />
        )}

        {expanded && (
          <FullPlayer onClose={() => setExpanded(false)} />
        )}
      </div>

      {/* MiniPlayer only when collapsed */}
      {!expanded && (
        <MiniPlayer onExpand={() => setExpanded(true)} />
      )}

      {/* Content area */}
      <div style={{ padding: "12px 12px 56px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
