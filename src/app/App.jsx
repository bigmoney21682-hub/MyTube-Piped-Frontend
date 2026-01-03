/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Main application shell with router + layout + global pinned player.
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

export default function App() {
  useEffect(() => {
    try {
      window.bootDebug?.ready();
    } catch (err) {
      console.warn("bootDebug.ready() failed:", err);
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

      {/* ⭐ Global pinned player container (always in DOM) */}
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

      {/* Main content area, scrolls under the pinned player */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: "60px", // header
          paddingBottom: "56px" // footer
        }}
      >
        <div
          style={{
            paddingTop: "220px" // space for pinned player
          }}
        >
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
