// File: src/App.jsx

import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Watch from "./pages/Watch"; // ✅ REQUIRED — was missing
import BootSplash from "./components/BootSplash";
import Footer from "./components/Footer";

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} /> {/* ✅ FIX */}
            <Route path="/playlists" element={<Playlists />} />
          </Routes>

          <Footer />
        </>
      )}
    </PlaylistProvider>
  );
}
