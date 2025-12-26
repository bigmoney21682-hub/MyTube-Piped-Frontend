import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        gap: 8,
        padding: "12px 16px",
        background: "#000",
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #333",
          background: "#111",
          color: "#fff",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: "#fff",
          color: "#000",
          fontWeight: 600,
        }}
      >
        Go
      </button>
    </form>
  );
}
