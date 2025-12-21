// File: src/components/SearchBar.jsx
// PCC v1.0 — Preservation-First Mode

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => setQuery(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) onSearch(query.trim());
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
    <input
      type="text"
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Search videos..."
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        maxWidth: 600,
        background: "#222",
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid #555",
        background: "#111",
        color: "#fff",
        borderRadius: 8,
        margin: "0 auto",
      }}
    />
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
      <button
        onClick={() => onSearch && onSearch(query)}
        style={{
          background: "#ff4500",
          border: "none",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 6,
          cursor: "pointer",
          marginLeft: 6,
        }}
      >
        🔍
      </button>
    </div>
  );
}
