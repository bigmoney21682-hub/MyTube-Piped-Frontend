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

// ⭐ PlayerShell (Mini + Full)
import PlayerShell from "../player/PlayerShell.jsx";

// ⭐ Global player init
import { GlobalPlayer } from "../player/GlobalPlayer_v2.js";

export default function App() {
  useEffect(() => {
    try {
      window.bootDebug?.ready();
    } catch (err) {
      console.warn("bootDebug.ready() failed:", err);
    }

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

      {/* ⭐ PlayerShell (Mini + Full) */}
      <PlayerShell />

      {/* Scrollable content area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: "60px",   // header height
          paddingBottom: "56px" // footer height
        }}
      >
        {/* ⭐ Removed the hardcoded 48px padding */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/channel/:id" element={<Channel />} />

          <Route path="/menu" element={<Menu />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/subs" element={<Subs />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
