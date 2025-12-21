// File: src/components/SearchBar.jsx
// PCC v1.0 — Preservation-First Mode

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) onSearch(query);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        background: "#111",
        padding: "6px 12px",
        borderRadius: 24, // keeps oval shape
        border: "1px solid #555",
        margin: "0 auto",
      }}
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Search videos, playlists..."
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          color: "#fff",
          outline: "none",
          fontSize: 14,
        }}
      />

      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          height: 24,
          background: "#555",
          margin: "0 8px",
        }}
      />

      {/* Red search button */}
      <button
        onClick={() => onSearch && onSearch(query)}
        style={{
          background: "#ff0000", // red button
          border: "none",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
}
