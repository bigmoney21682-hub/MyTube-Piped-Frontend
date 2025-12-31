/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Main application shell. No DebugOverlay here.
 */

import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Header from "../components/Header.jsx";
import Footer, { FOOTER_HEIGHT } from "../layout/Footer.jsx";

// Pages
import Home from "../pages/Home/Home.jsx";
import Watch from "../pages/Watch/Watch.jsx";
import Menu from "../pages/Menu.jsx";
import Playlists from "../pages/Playlists.jsx";
import Shorts from "../pages/Shorts.jsx";
import Subs from "../pages/Subs.jsx";

// Player
import MiniPlayer from "../player/MiniPlayer.jsx";
import { GlobalPlayer } from "../player/GlobalPlayer.js";

export default function App() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        paddingBottom: FOOTER_HEIGHT
      }}
    >
      <Header />

      {/* GlobalPlayer loads via side effects */}
      <MiniPlayer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/subs" element={<Subs />} />
      </Routes>

      <Footer />
    </div>
  );
}
