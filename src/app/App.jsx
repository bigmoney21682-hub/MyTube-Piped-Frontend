/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description:
 *   Layout controller.
 *   - Header at top
 *   - Player area pinned under header
 *   - FullPlayer overlays iframe when expanded
 *   - MiniPlayer only visible when collapsed AND a video is loaded
 *   - MiniPlayer pinned under header
 *   - Content scrolls underneath
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
        height: "100%",
        background: "#000",
        color: "#fff",
        overflowX: "hidden"
      }}
    >
      <Header />

      {/* ⭐ PLAYER AREA (pinned under header) */}
      <div
        style={{
          width: "100%",
          height: 220,
          position: "sticky",
          top: 60,
          zIndex: 1000,
          background: "#000",
          overflow: "hidden"
        }}
      >
        {/* ⭐ IFRAME ALWAYS MOUNTED */}
        <div
          id="yt-player"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            background: "#000",
            zIndex: 1
          }}
        />

        {/* ⭐ FULLPLAYER OVERLAY */}
        {expanded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2
            }}
          >
            <FullPlayer onClose={() => setExpanded(false)} />
          </div>
        )}
      </div>

      {/* ⭐ MINIPLAYER (only when collapsed AND video loaded) */}
      {currentId && !expanded && (
        <div
          style={{
            position: "sticky",
            top: 60,              // directly under header
            zIndex: 1500,         // above player
            height: "auto",       // ⭐ prevents inheriting 220px
            display: "inline-block", // ⭐ prevents sticky height inheritance
            background: "#000"    // ⭐ fixes Safari sticky stacking bug
          }}
        >
          <MiniPlayer onExpand={() => setExpanded(true)} />
        </div>
      )}

      {/* ⭐ CONTENT AREA */}
      <div style={{ paddingTop: 12, paddingBottom: 56 }}>
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
