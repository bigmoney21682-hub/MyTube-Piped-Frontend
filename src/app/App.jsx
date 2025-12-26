/**
 * File: App.jsx
 * Path: src/App.jsx
 * Description: Root application shell with routing + DebugOverlay v3 integration.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home/Home";
import Watch from "./pages/Watch/Watch";

import DebugOverlay from "./debug/DebugOverlay";

export default function App() {
  // Boot logs
  useEffect(() => {
    window.bootDebug?.boot("App.jsx mounted — initializing router");
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#000",
        color: "#fff",
        position: "relative"
      }}
    >
      {/* Router */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </BrowserRouter>

      {/* Debug Overlay */}
      <DebugOverlay />
    </div>
  );
}
