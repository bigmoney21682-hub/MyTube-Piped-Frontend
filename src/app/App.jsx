/**
 * File: App.jsx
 * Path: src/app/App.jsx
 */

import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../layout/Footer.jsx";
import MiniPlayer from "../player/MiniPlayer.jsx";

import Home from "../pages/Home/Home.jsx";
import Playlists from "../pages/Playlists.jsx";
import Search from "../pages/Search.jsx";

export default function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        color: "#fff",
        overflowX: "hidden",
        position: "relative"
      }}
    >
      <Header />

      <div
        style={{
          paddingTop: "60px",
          paddingBottom: "56px"
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </div>

      <div style={{ position: "fixed", bottom: "56px", width: "100%", zIndex: 999 }}>
        <MiniPlayer />
      </div>

      <Footer />
    </div>
  );
}
