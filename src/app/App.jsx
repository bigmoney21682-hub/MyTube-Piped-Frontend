/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Root application shell with BrowserRouter, PlayerProvider,
 *              MiniPlayer, DebugOverlay, and robust iframe docking logic.
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
import { debugBus } from "../debug/debugBus.js";

/* ------------------------------------------------------------
   RouterEvents
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
   IframeDock
   Moves the global YouTube iframe into the Watch page container
   when on /watch/:id, and back into its hidden home otherwise.
   Retries a few times so it can wait for #player to mount.
------------------------------------------------------------- */
function IframeDock() {
  const location = useLocation();

  useEffect(() => {
    const iframe = document.getElementById("global-player");
    const home = document.getElementById("global-player-container");

    if (!iframe || !home) {
      debugBus.player("IframeDock → missing iframe or home");
      return;
    }

    const path = location.pathname || "";
    const onWatchPage = path.startsWith("/watch/");

    debugBus.player(
      "IframeDock → location=" +
        path +
        " onWatchPage=" +
        onWatchPage
    );

    let cancelled = false;

    function attachToWatch() {
      if (cancelled) return;

      const watch = document.getElementById("player");
      if (watch && watch !== iframe.parentNode) {
        debugBus.player("IframeDock → moving iframe into #player");
        watch.appendChild(iframe);
        return true;
      }

      return false;
    }

    function attachHome() {
      if (home !== iframe.parentNode) {
        debugBus.player("IframeDock → moving iframe back home");
        home.appendChild(iframe);
      }
    }

    if (onWatchPage) {
      // Try immediately
      if (!attachToWatch()) {
        // Retry up to ~2 seconds while the Watch DOM mounts
        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(() => {
          if (cancelled) {
            clearInterval(interval);
            return;
          }
          attempts += 1;
          if (attachToWatch() || attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 100);
      }
    } else {
      attachHome();
    }

    return () => {
      cancelled = true;
    };
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
        <IframeDock />

        {/* Layout wrapper ensures MiniPlayer never overlaps content */}
        <div style={{ paddingBottom: "80px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/channel/:id" element={<Channel />} />
          </Routes>
        </div>

        {/* Persistent global mini-player */}
        <MiniPlayer />

        {/* Runtime debug overlay */}
        <DebugOverlay />
      </BrowserRouter>
    </PlayerProvider>
  );
}
