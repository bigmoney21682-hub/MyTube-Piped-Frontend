// File: src/components/SearchBar.jsx
// PCC v4.0 — Crash‑proof SearchBar with safe dropdown + safe submit

import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // ------------------------------------------------------------
  // Load search history on mount
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      if (Array.isArray(saved)) setHistory(saved);
    } catch {
      setHistory([]);
    }
  }, []);

  // ------------------------------------------------------------
  // Save search history
  // ------------------------------------------------------------
  const saveHistory = (term) => {
    if (!term || typeof term !== "string") return;

    const updated = [term, ...history.filter((h) => h !== term)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // ------------------------------------------------------------
  // Debounce autocomplete suggestions
  // ------------------------------------------------------------
  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(
            q
          )}`
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data[1]) ? data[1] : []);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [q]);

  // ------------------------------------------------------------
  // Safe submit — ignores accidental event objects
  // ------------------------------------------------------------
  const submit = (term) => {
    // If React passed a synthetic event, ignore it
    if (term && typeof term === "object") return;

    const query = term || q.trim();
    if (!query) return;

    saveHistory(query);
    onSearch(query);

    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  // ------------------------------------------------------------
  // Keyboard navigation
  // ------------------------------------------------------------
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    const list = [...history, ...suggestions];
    if (list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % list.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + list.length) % list.length);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        submit(list[highlightIndex]);
      } else {
        submit();
      }
    }
  };

  // ------------------------------------------------------------
  // Close dropdown when clicking outside
  // ------------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div style={{ width: "80%", maxWidth: 520, position: "relative" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        style={{
          display: "flex",
          borderRadius: 999,
          overflow: "hidden",
          border: "1px solid #333",
          background: "#000",
        }}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search YouTube"
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#fff",
            fontSize: "1rem",
          }}
        />

        <div style={{ width: 1, background: "#333" }} />

        <button
          type="submit"
          style={{
            padding: "0 16px",
            border: "none",
            background: "#ff0000",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && (history.length > 0 || suggestions.length > 0) && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#111",
            border: "1px solid #333",
            borderTop: "none",
            zIndex: 999,
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {[...history, ...suggestions].map((item, i) => (
            <div
              key={i}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur
                submit(item);       // pass ONLY the string
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                background: i === highlightIndex ? "#222" : "transparent",
                color: "#fff",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
