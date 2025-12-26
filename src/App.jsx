// File: src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PlayerProvider } from "./contexts/PlayerContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalPlayer from "./components/GlobalPlayer";
import MiniPlayer from "./components/MiniPlayer";
import DebugOverlay from "./components/DebugOverlay";

import Home from "./pages/Home";
import Watch from "./pages/Watch";

export default function App() {
  return (
    <Router basename="/MyTube-Piped-Frontend">
      <PlayerProvider>
        <Header />

        <GlobalPlayer />
        <MiniPlayer />
        <DebugOverlay />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch" element={<Watch />} />
        </Routes>

        <Footer />
      </PlayerProvider>
    </Router>
  );
}
