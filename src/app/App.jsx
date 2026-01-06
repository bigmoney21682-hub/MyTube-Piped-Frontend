/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description:
 *   Root router + pages.
 *   Watch page removed — /watch/:id now routes to Home.
 *   Includes full route debugging for Mac Web Inspector.
 */

import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "../pages/Home/Home.jsx";
import Search from "../pages/Search.jsx";

// ------------------------------------------------------------
// Debug helper
// ------------------------------------------------------------
function dbg(label, data = {}) {
  console.group(`[ROUTER] ${label}`);
  for (const k in data) console.log(k + ":", data[k]);
  console.groupEnd();
}

export default function App() {
  const location = useLocation();

  // ------------------------------------------------------------
  // Log route changes
  // ------------------------------------------------------------
  useEffect(() => {
    dbg("Route changed", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    });
  }, [location]);

  return (
    <Routes>
      {/* Home is now the Now Playing page */}
      <Route path="/" element={<Home />} />

      {/* Watch route now points to Home */}
      <Route path="/watch/:id" element={<Home />} />

      {/* Search page unchanged */}
      <Route path="/search/:query" element={<Search />} />
    </Routes>
  );
}
