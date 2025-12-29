/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Root application shell with BrowserRouter, PlayerProvider,
 *              global Header (title + search), MiniPlayer, and DebugOverlay.
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

function RouterEvents() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    installRouterLogger(navigate, location);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter basename="/MyTube-Piped-Frontend">
        <RouterEvents />

        <Header />

        {/* FIX: allow DebugOverlay to render above this container */}
        <div style={{ paddingTop: "60px", paddingBottom: "80px", overflow: "visible" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/channel/:id" element={<Channel />} />
          </Routes>
        </div>

        <MiniPlayer />
        <DebugOverlay />
      </BrowserRouter>
    </PlayerProvider>
  );
}
