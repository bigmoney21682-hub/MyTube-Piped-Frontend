/**
 * ------------------------------------------------------------
 *  File: App.jsx
 *  Path: src/app/App.jsx
 *  Description:
 *    Main application shell for MyTube.
 *    Provides:
 *      - Global pinned YouTube player container (always in DOM)
 *      - Header + Footer layout
 *      - Scrollable routed content area
 *      - React Router page routing
 *      - Boot debug readiness hook
 * ------------------------------------------------------------
 */

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home.jsx";
import Search from "../pages/Search.jsx";
import Watch from "../pages/Watch/Watch.jsx";
import Playlist from "../pages/Playlist.jsx";
import Channel from "../pages/Channel.jsx";

// Restored pages
import Menu from "../pages/Menu.jsx";
import Playlists from "../pages/Playlists.jsx";
import Shorts from "../pages/Shorts.jsx";
import Subs from "../pages/Subs.jsx";

import Header from "../components/Header.jsx";
import Footer from "../layout/Footer.jsx";

// ⭐ NEW: Import the deep‑debug global player
import { GlobalPlayer } from "../player/GlobalPlayer_v2.js";

export default function App() {
  useEffect(() => {
    try {
      window.bootDebug?.ready();
    } catch (err) {
      console.warn("bootDebug.ready() failed:", err);
    }

    // ⭐ Initialize the global YouTube player
    try {
      GlobalPlayer.init();
    } catch (err) {
      console.warn("GlobalPlayer.init() failed:", err);
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
      {/* Global pinned YouTube player container */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          right: 0,
          zIndex: 900,
          background: "#000"
        }}
      >
        <div
          id="player"
          style={{
            width: "100%",
            height: "220px",
            background: "#000",
            position: "relative"
          }}
        ></div>
      </div>

      <Header />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: "60px",
          paddingBottom: "56px"
        }}
      >
        <div style={{ paddingTop: "220px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/channel/:id" element={<Channel />} />

            <Route path="/menu" element={<Menu />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/subs" element={<Subs />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
}
