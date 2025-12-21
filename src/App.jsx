import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Watch from "./pages/Watch";

import BootSplash from "./components/BootSplash";
import Footer from "./components/Footer";
import DebugOverlay from "./components/DebugOverlay";
import Header from "./components/Header"; // ✅ Correct import

import { PlaylistProvider } from "./contexts/PlaylistContext";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <PlaylistProvider>
      <BootSplash ready={ready} />

      {ready && (
        <>
          <Header />

          {/* 🔒 GLOBAL DEBUG OVERLAY (ONCE) */}
          <DebugOverlay />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/watch/:id" element={<Watch />} />
          </Routes>

          <Footer />
        </>
      )}
    </PlaylistProvider>
  );
}
