/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Root application shell with BrowserRouter, PlayerProvider,
 *              global Header (title + search), MiniPlayer, and DebugOverlay.
 *              No iframe docking; GlobalPlayer mounts directly in Watch page.
 */

import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

import { PlayerProvider } from "../player/PlayerContext.jsx";
import MiniPlayer from "../player/MiniPlayer.jsx";

import Home from "../pages/Home/Home.jsx";
import Watch from "../pages/Watch/Watch.jsx";
import Search from "../pages/Search.jsx";
import Channel from "../pages/Channel.jsx";

import DebugOverlay from "../debug/DebugOverlay.jsx";
import { installRouterLogger } from "../debug/debugRouter.js";

import Header from "../components/Header.jsx";

/* ------------------------------------------------------------
   RouterEvents
   Hooks into BrowserRouter and emits navigation logs
------------------------------------------------------------- */
function RouterEvents() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    installRouterLogger(navigate, location);
  }, [location]);

  return null;
}

/* ------------------------------------------------------------
   App Shell
------------------------------------------------------------- */
export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter basename="/MyTube-Piped-Frontend">
        <RouterEvents />

        {/* Global header with title + search */}
        <Header />

        {/* Layout wrapper:
             - paddingTop matches Header height
             - paddingBottom reserves space for MiniPlayer */}
        <div style={{ paddingTop: "60px", paddingBottom: "80px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/channel/:id" element={<Channel />} />
          </Routes>
        </div>

        {/* Persistent global mini-player */}
        <MiniPlayer />

        {/* Runtime debug overlay (non-blocking) */}
        <DebugOverlay />
      </BrowserRouter>
    </PlayerProvider>
  );
}
