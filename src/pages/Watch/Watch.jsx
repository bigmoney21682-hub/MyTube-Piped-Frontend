/**
 * File: Watch.jsx
 * Path: src/pages/Watch/Watch.jsx
 * Description: Full video watch page with safe destructuring, normalized IDs,
 *              related videos, autonext integration, and PlayerContext wiring.
 */

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayer } from "../../player/PlayerContext.jsx";
import { AutonextEngine } from "../../player/AutonextEngine.js";
import { debugBus } from "../../debug/debugBus.js";

const API_KEY = import.meta.env.VITE_YT_API_KEY;

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Safe PlayerContext extraction
  const player = usePlayer() ?? {};
  const loadVideo = player.loadVideo ?? (() => {});
  const queueAdd = player.queueAdd ?? (() => {});
  const autonextMode = player.autonextMode ?? "related";
  const setAutonextMode = player.setAutonextMode ?? (() => {});

  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);

  // Keep a ref so autonext callback always sees latest related[]
  const relatedRef = useRef([]);
  useEffect(() => {
    relatedRef.current = related;
  }, [related]);

  // ------------------------------------------------------------
  // Load video on route change
  // ------------------------------------------------------------
  useEffect(() => {
    if (!id) return;

    debugBus.player("Watch.jsx → loadVideo(" + id + ")");
    loadVideo(id);

    fetchVideoDetails(id);
    fetchRelated(id);
  }, [id]);

  // ------------------------------------------------------------
  // Register autonext callback ONCE
  // ------------------------------------------------------------
  useEffect(() => {
    AutonextEngine.registerRelatedCallback(() => {
      debugBus.player("Watch.jsx → Autonext (related) triggered");

      const list = relatedRef.current;
      if (!Array.isArray(list) || list.length === 0) {
        debugBus.player("Watch.jsx → No related videos available");
        return;
      }

      const next =
        list[0]?.id?.videoId ??
        list[0]?.id ??
        null;

      if (!next) {
        debugBus.player("Watch.jsx → Related[0] missing ID");
        return;
      }

      debugBus.player("Watch.jsx → Autonext → " + next);
      navigate(`/watch/${next}`);
      loadVideo(next);
    });
  }, []); // register once

  // ------------------------------------------------------------
  // Fetch video details
  // ------------------------------------------------------------
  async function fetchVideoDetails(videoId) {
    try {
      const url =
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=snippet,statistics&id=${videoId}&key=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      const items = Array.isArray(data?.items) ? data.items : [];
      setVideo(items[0] ?? null);
    } catch (err) {
      debugBus.player("Watch.jsx → fetchVideoDetails error: " + (err?.message || err));
      setVideo(null);
    }
  }

  // ------------------------------------------------------------
  // Fetch related videos
  // ------------------------------------------------------------
  async function fetchRelated(videoId) {
    try {
      const url =
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&type=video&relatedToVideoId=${videoId}&maxResults=25&key=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      setRelated(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      debugBus.player("Watch.jsx → fetchRelated error: " + (err?.message || err));
      setRelated([]);
    }
  }

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  if (!video) {
    return (
      <div style={{ padding: "16px", color: "#fff" }}>
        Loading video…
      </div>
    );
  }

  const sn = video?.snippet ?? {};
  const title = sn?.title ?? "Untitled";

  return (
    <div style={{ paddingBottom: "80px", color: "#fff" }}>
      {/* Title */}
      <h2 style={{ padding: "16px" }}>{title}</h2>

      {/* Autonext toggle */}
      <div style={{ padding: "16px" }}>
        <label style={{ marginRight: "12px" }}>Autonext:</label>
        <select
          value={autonextMode}
          onChange={(e) => setAutonextMode(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="related">Related</option>
          <option value="playlist">Playlist</option>
        </select>
      </div>

      {/* Add to queue */}
      <div style={{ padding: "16px" }}>
        <button
          onClick={() => queueAdd(id)}
          style={{
            padding: "10px 16px",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "4px"
          }}
        >
          + Add to Queue
        </button>
      </div>

      {/* Related videos */}
      <div style={{ padding: "16px" }}>
        <h3>Related Videos</h3>

        {related.map((item, i) => {
          const vid =
            item?.id?.videoId ??
            item?.id ??
            null;

          const sn = item?.snippet ?? {};
          const thumb = sn?.thumbnails?.medium?.url ?? "";

          if (!vid) return null;

          return (
            <a
              key={vid + "_" + i}
              href={`/watch/${vid}`}
              style={{
                display: "flex",
                marginBottom: "12px",
                textDecoration: "none",
                color: "#fff"
              }}
            >
              <img
                src={thumb}
                alt=""
                style={{
                  width: "168px",
                  height: "94px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "12px"
                }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {sn.title ?? "Untitled"}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  {sn.channelTitle ?? "Unknown Channel"}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
