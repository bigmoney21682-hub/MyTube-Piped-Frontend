/**
 * File: Header.jsx
 * Path: src/components/Header.jsx
 * Description: Global app header with MyTube title and search bar + history.
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadHistory, saveHistory } from "../search/searchHistory.js";

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Save to history
    const updated = saveHistory(q);
    setHistory(updated);

    navigate(`/search?q=${encodeURIComponent(q)}`);
    setShowDropdown(false);
  }

  function handleSelect(item) {
    setQuery(item);
    navigate(`/search?q=${encodeURIComponent(item)}`);
    setShowDropdown(false);
  }

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "#111",
        borderBottom: "1px solid #222",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        zIndex: 1000
      }}
    >
      {/* Title */}
      <div
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          fontSize: "1.4rem",
          fontWeight: "bold",
          marginRight: 12,
          background: "linear-gradient(90deg, #ff8c00, #ff4500, #ff0000)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          whiteSpace: "nowrap"
        }}
      >
        🔥 MyTube
      </div>

      {/* Search bar */}
      <div style={{ flex: 1, position: "relative" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: 8
          }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search…"
            style={{
              flex: 1,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #444",
              background: "#222",
              color: "#fff"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: "#ff0000",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Go
          </button>
        </form>

        {/* Search history dropdown */}
        {showDropdown && history.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "42px",
              left: 0,
              right: 0,
              background: "#111",
              border: "1px solid #333",
              borderRadius: 6,
              padding: "6px 0",
              zIndex: 2000
            }}
          >
            {history.map((item, i) => (
              <div
                key={i}
                onClick={() => handleSelect(item)}
                style={{
                  padding: "6px 10px",
                  cursor: "pointer",
                  color: "#fff",
                  borderBottom: "1px solid #222"
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
