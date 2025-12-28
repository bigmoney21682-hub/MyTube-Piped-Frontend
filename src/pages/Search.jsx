/**
 * File: Search.jsx
 * Path: src/pages/Search.jsx
 * Description: Search page with safe destructuring, normalized IDs,
 *              YouTube Data API v3 search, and PlayerContext wiring.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePlayer } from "../player/PlayerContext.jsx";
import { debugBus } from "../debug/debugBus.js";

const API_KEY = import.meta.env.VITE_YT_API_KEY;

export default function Search() {
  const [results, setResults] = useState([]);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loadVideo, queueAdd } = usePlayer();

  const query = params.get("q") ?? "";

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    fetchSearch(query);
  }, [query]);

  // ------------------------------------------------------------
  // Fetch search results
  // ------------------------------------------------------------
  async function fetchSearch(q) {
    try {
      debugBus.player("Search.jsx → Searching for: " + q);

      const url =
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&type=video&maxResults=25&q=${encodeURIComponent(q)}&key=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      setResults(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      debugBus.player("Search.jsx → fetchSearch error: " + err?.message);
    }
  }

  // ------------------------------------------------------------
  // Open video
  // ------------------------------------------------------------
  function openVideo(id) {
    if (!id) return;
    debugBus.player("Search.jsx → Navigate to /watch/" + id);
    navigate(`/watch/${id}`);
    loadVideo(id);
  }

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      <h2 style={{ marginBottom: "16px" }}>
        Results for: <span style={{ opacity: 0.7 }}>{query}</span>
      </h2>

      {results.map((item, i) => {
        const vid =
          item?.id?.videoId ??
          item?.id ??
          null;

        const sn = item?.snippet ?? {};
        const thumb = sn?.thumbnails?.medium?.url ?? "";

        if (!vid) return null;

        return (
          <div
            key={vid + "_" + i}
            style={{
              display: "flex",
              marginBottom: "16px",
              cursor: "pointer"
            }}
          >
            <img
              src={thumb}
              alt=""
              onClick={() => openVideo(vid)}
              style={{
                width: "168px",
                height: "94px",
                objectFit: "cover",
                borderRadius: "4px",
                marginRight: "12px"
              }}
            />

            <div style={{ flex: 1 }}>
              <div
                onClick={() => openVideo(vid)}
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginBottom: "4px"
                }}
              >
                {sn.title ?? "Untitled"}
              </div>

              <div style={{ fontSize: "13px", opacity: 0.7 }}>
                {sn.channelTitle ?? "Unknown Channel"}
              </div>

              <button
                onClick={() => queueAdd(vid)}
                style={{
                  marginTop: "8px",
                  padding: "6px 10px",
                  background: "#222",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "4px"
                }}
              >
                + Queue
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
