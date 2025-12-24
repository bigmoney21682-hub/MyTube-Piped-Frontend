// File: src/components/Header.jsx
// PCC v1.0 — Clean, safe, crash‑proof header

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  };

  return (
    <header
      style={{
        padding: "12px 16px",
        background: "#111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        🔥 MyTube
      </button>

      <form
        onSubmit={handleSubmit}
        style={{ flex: 1, display: "flex", gap: 8 }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
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
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>
    </header>
  );
}
