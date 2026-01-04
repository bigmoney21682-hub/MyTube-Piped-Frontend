/**
 * ------------------------------------------------------------
 *  File: App.jsx
 *  Path: src/app/App.jsx
 *  Description:
 *    Main application shell for MyTube.
 *
 *    New architecture:
 *      - Header (fixed)
 *      - PlayerShell (fixed under header)
 *      - Scrollable content area
 *      - Footer (fixed)
 *
 *    Notes:
 *      - GlobalPlayer_v2 is initialized here
 *      - /watch route removed (Home is now Now Playing page)
 * ------------------------------------------------------------
 */

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home.jsx";
import Search from "../pages/Search.jsx";
import Playlist from "../pages/Playlist.jsx";
import Channel from "../pages/Channel.jsx";

// Restored pages
import Menu from "../pages/Menu.jsx";
import Playlists from "../pages/Playlists.jsx";
import Shorts from "../pages/Shorts.jsx";
import Subs from "../pages/Subs.jsx";

import Header from "../components/Header.jsx";
import Footer from "../layout/Footer.jsx";

// ⭐ NEW: PlayerShell replaces the old pinned #player container
import PlayerShell from "../player/PlayerShell.jsx";

// ⭐ Correct global player import
import { GlobalPlayer } from "../player/GlobalPlayer_v2.js";

export default function App() {
  useEffect(() => {
    try {
      window.bootDebug?.ready();
    } catch (err) {
      console.warn("bootDebug.ready() failed:", err);
    }

    // ⭐ Initialize the global YouTube player (v2)
    try {
      GlobalPlayer.init();
    } catch (err) {
      console.warn("GlobalPlayer_v2.init() failed:", err);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#111",
        color: "#fff"
      }}
    >
      <Header />

      {/* ⭐ NEW: PlayerShell (Mini + Full) */}
      <PlayerShell />

      {/* Scrollable content area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: "60px", // header height
          paddingBottom: "56px" // footer height
        }}
      >
        {/* Content automatically sits below PlayerShell */}
        <div style={{ paddingTop: "48px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/channel/:id" element={<Channel />} />

            <Route path="/menu" element={<Menu />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/subs" element={<Subs />} />

            {/* Removed: /watch/:id */}
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
}
