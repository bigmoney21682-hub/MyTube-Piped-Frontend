/**
 * File: Search.jsx
 * Path: src/pages/Search.jsx
 * Description: Search results page using cached YouTube Data API wrapper
 *              with stacked 16:9 thumbnails and quota‑safe behavior.
 */

import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { debugBus } from "../debug/debugBus.js";

// ⭐ NEW — cached search API
import { searchVideos } from "../api/search.js";

const cardStyle = {
  width: "100%",
  marginBottom: "20px",
  textDecoration: "none",
  color: "#fff",
  display: "block"
};

const thumbStyle = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "8px"
};

const titleStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "4px"
};

const channelStyle = {
  fontSize: "13px",
  opacity: 0.7,
  marginBottom: "6px"
};

const descStyle = {
  fontSize: "13px",
  opacity: 0.8,
  lineHeight: 1.4
};

export default function Search() {
  const location = useLocation();
  const [results, setResults] = useState([]);

  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";

  useEffect(() => {
    if (!query) return;

    debugBus.log("PLAYER", "Search.jsx → Searching: " + query);
    loadResults(query);
  }, [query]);

  /* ------------------------------------------------------------
     ⭐ NEW — Cached search
  ------------------------------------------------------------- */
  async function loadResults(q) {
    try {
      const list = await searchVideos(q, 20);

      if (!Array.isArray(list)) {
        debugBus.log("PLAYER", "Search.jsx → searchVideos returned invalid list");
        setResults([]);
        return;
      }

      // Convert cached format → old snippet format
      const normalized = list.map((item) => ({
        id: { videoId: item.id },
        snippet: {
          title: item.title,
          channelTitle: item.author,
          description: "",
          thumbnails: {
            medium: { url: item.thumbnail }
          }
        }
      }));

      debugBus.log("PLAYER", `Search.jsx → Loaded ${normalized.length} results`);
      setResults(normalized);
    } catch (err) {
      debugBus.log("PLAYER", "Search.jsx → loadResults error: " + err?.message);
      setResults([]);
    }
  }

  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      <h2 style={{ marginBottom: "12px" }}>
        Search results for: {query || "…"}
      </h2>

      {results.map((item, i) => {
        const vid = item?.id?.videoId;
        const sn = item?.snippet ?? {};
        const thumb = sn?.thumbnails?.medium?.url ?? "";

        if (!vid) return null;

        return (
          <Link
            key={vid + "_" + i}
            to={`/watch/${vid}`}
            style={cardStyle}
          >
            <img
              src={thumb}
              alt={sn.title ?? "Video thumbnail"}
              style={thumbStyle}
            />

            <div style={titleStyle}>{sn.title ?? "Untitled"}</div>
            <div style={channelStyle}>{sn.channelTitle ?? "Unknown Channel"}</div>
            <div style={descStyle}>{sn.description ?? ""}</div>
          </Link>
        );
      })}
    </div>
  );
}
