// File: src/components/SearchBar.jsx
// PCC v1.0 — Preservation-First Mode

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        background: "#111",
        color: "#fff",
        borderRadius: 999, // keep oval shape
        padding: "4px 6px",
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
          padding: "6px 12px",
        }}
      />

      {/* Vertical Divider */}
      <div
        style={{
          width: 1,
          height: 24,
          background: "#555",
          margin: "0 8px",
        }}
      />

      <button
        onClick={() => onSearch && onSearch(query)}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          padding: "6px 12px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 14,
        }}
      >
        Search
      </button>
    </div>
  );
}
