/**
 * File: Footer.jsx
 * Path: src/layout/Footer.jsx
 * Description: Fixed bottom navigation bar with 5 equal-width buttons.
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";

const footerHeight = 56;

export const FOOTER_HEIGHT = footerHeight;

export default function Footer() {
  const location = useLocation();

  const tabs = [
    { to: "/menu", label: "📂 Menu" },
    { to: "/playlists", label: "🎵 Playlists" },
    { to: "/", label: "🏠 Home" },
    { to: "/shorts", label: "🎬 Shorts" },
    { to: "/subs", label: "⭐ Subs" }
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: footerHeight,
        background: "#111",
        borderTop: "1px solid #222",
        display: "flex",
        zIndex: 1000,
        userSelect: "none"
      }}
    >
      {tabs.map((tab) => {
        const active = location.pathname === tab.to;

        return (
          <Link
            key={tab.to}
            to={tab.to}
            style={{
              flex: 1,
              textDecoration: "none",
              color: active ? "#3ea6ff" : "#ccc",
              fontSize: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
