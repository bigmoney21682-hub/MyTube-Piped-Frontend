/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Main application shell with Footer, MiniPlayer, GlobalPlayer,
 *              DebugOverlay, and full routing.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../components/Header.jsx";                 // ✅ Correct
import Footer, { FOOTER_HEIGHT } from "../layout/Footer.jsx";  // ✅ Correct

import Home from "../pages/Home/Home.jsx";                     // ✅ Correct path
import Watch from "../pages/Watch/Watch.jsx";                  // (unchanged)
import Menu from "../pages/Menu.jsx";                          // (your new file)
import Playlists from "../pages/Playlists.jsx";                // (your new file)
import Shorts from "../pages/Shorts.jsx";                      // (your new file)
import Subs from "../pages/Subs.jsx";                          // (your new file)

import GlobalPlayer from "../player/GlobalPlayer.jsx";         // (unchanged)
import MiniPlayer from "../player/MiniPlayer.jsx";             // (corrected earlier)
import DebugOverlay from "../debug/DebugOverlay.jsx";          // (corrected earlier)

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
