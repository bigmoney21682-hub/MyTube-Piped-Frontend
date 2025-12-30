/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Main application shell with Footer, MiniPlayer, GlobalPlayer,
 *              DebugOverlay, and full routing.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../components/Header.jsx";          // ✅ FIXED PATH
import Footer, { FOOTER_HEIGHT } from "../layout/Footer.jsx";

import Home from "../pages/Home.jsx";
import Watch from "../pages/Watch/Watch.jsx";
import Menu from "../pages/Menu.jsx";
import Playlists from "../pages/Playlists.jsx";
import Shorts from "../pages/Shorts.jsx";
import Subs from "../pages/Subs.jsx";

import GlobalPlayer from "../player/GlobalPlayer.jsx";
import MiniPlayer from "../player/MiniPlayer.jsx";
import DebugOverlay from "../debug/DebugOverlay.jsx";

export default function App() {
  return (
    <Router basename="/">
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          paddingBottom: FOOTER_HEIGHT // ensures content never hides behind footer
        }}
      >
        {/* Header */}
        <Header />

        {/* Global Player (hidden iframe) */}
        <GlobalPlayer />

        {/* MiniPlayer (fixed, above footer + debug overlay) */}
        <MiniPlayer />

        {/* DebugOverlay (fixed, above footer) */}
        <DebugOverlay />

        {/* Main Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/subs" element={<Subs />} />
        </Routes>

        {/* Footer (fixed bottom) */}
        <Footer />
      </div>
    </Router>
  );
}
