/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description:
 *   Master layout controller for MyTubes.
 *
 *   FIXED:
 *   - MiniPlayer no longer overlays header on boot
 *   - MiniPlayer no longer scrolls over header
 *   - Sticky stacking context collision resolved
 *
 *   Layout:
 *   - Header at top (60px)
 *   - Player area pinned under header (220px)
 *   - MiniPlayer pinned UNDER player area (top: 280px)
 *   - FullPlayer overlays iframe when expanded
 *   - Content scrolls underneath everything
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
      {/* HEADER */}
      <Header />

      {/* PLAYER AREA (sticky under header) */}
      <div
        style={{
          width: "100%",
          height: 220,
          position: "sticky",
          top: 60,           // header height
          zIndex: 1000,
          background: "#000",
          overflow: "hidden"
        }}
      >
        {/* IFRAME ALWAYS MOUNTED */}
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

        {/* FULLPLAYER OVERLAY */}
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

      {/* MINIPLAYER — now in its own sticky lane */}
      {currentId && !expanded && (
        <div
          style={{
            position: "sticky",
            top: 280,          // 60 header + 220 player area
            zIndex: 1500,
            background: "#000",
            height: "auto",
            display: "block"
          }}
        >
          <MiniPlayer onExpand={() => setExpanded(true)} />
        </div>
      )}

      {/* CONTENT AREA */}
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
