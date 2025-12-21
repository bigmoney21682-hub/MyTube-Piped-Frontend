// File: src/components/SearchBar.jsx
// PCC v1.0 — Preservation-First Mode

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => setQuery(e.target.value);
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        background: "#111",        // search input background black
        padding: "6px 12px",
        borderRadius: 8,
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
          background: "transparent",  // keeps black input
          border: "none",
          color: "#fff",
          outline: "none",
          fontSize: 14,
        }}
      />
      <div
        style={{
          width: 1,
          height: 24,
          background: "#555",
          margin: "0 8px",
        }}
      />
      <button
        onClick={() => onSearch && onSearch(query.trim())}
        style={{
          background: "#ff0000",    // only button red
          border: "none",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
}
