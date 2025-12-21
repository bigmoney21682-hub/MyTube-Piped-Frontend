import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => setQuery(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) onSearch(query.trim());
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Search videos..."
      style={{
        width: "100%",
        maxWidth: 400,
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid #555",
        background: "#111",
        color: "#fff",
      }}
    />
  );
}
