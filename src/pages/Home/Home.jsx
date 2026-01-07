/**
 * File: Home.jsx
 * Path: src/pages/Home/Home.jsx
 * Description:
 *   Content page of the app.
 *   - NO PLAYER HERE (player lives in App.jsx)
 *   - Autonext source selector
 *   - Dynamic content area
 *   - Supplies metadata to PlayerContext
 *   - Registers state with AutonextEngine
 *   - ⭐ DebugOverlay mounted for full visibility
 */

import React, { useState, useEffect, useContext } from "react";

import { PlayerContext } from "../../player/PlayerContext.jsx";
import { usePlaylists } from "../../contexts/PlaylistContext.jsx";
import { AutonextEngine } from "../../player/AutonextEngine.js";

import { fetchTrending } from "../../api/trending.js";
import { fetchRelatedVideos } from "../../api/related.js";

import AddToPlaylistButton from "../../components/AddToPlaylistButton.jsx";
import DebugOverlay from "../../debug/DebugOverlay.jsx";

export default function Home() {
  const { currentId, loadVideo, setCurrentMeta } = useContext(PlayerContext);
  const { playlists } = usePlaylists();

  const [source, setSource] = useState("trending");
  const [items, setItems] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useState(null);

  /* ------------------------------------------------------------
     Load content based on source
  ------------------------------------------------------------ */
  useEffect(() => {
    async function load() {
      if (source === "trending") {
        const list = await fetchTrending();
        setItems(list || []);
      }

      if (source === "related" && currentId) {
        const list = await fetchRelatedVideos(currentId);
        setItems(list || []);
      }

      if (source === "playlist" && activePlaylistId) {
        const pl = playlists.find((p) => p.id === activePlaylistId);
        setItems(pl ? pl.videos : []);
      }
    }

    load();
  }, [source, currentId, activePlaylistId, playlists]);

  /* ------------------------------------------------------------
     Update MiniPlayer meta when currentId changes
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!currentId) return;

    const item = items.find(
      (v) => (v.id || v.videoId) === currentId
    );

    if (item) {
      setCurrentMeta({
        title: item.title || item.snippet?.title || "",
        thumbnail:
          item.thumbnail ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          ""
      });
    }
  }, [currentId, items, setCurrentMeta]);

  /* ------------------------------------------------------------
     Register autonext state with AutonextEngine
  ------------------------------------------------------------ */
  useEffect(() => {
    AutonextEngine.registerStateGetter(() => ({
      source,
      items,
      currentId,
      loadVideo
    }));
  }, [source, items, currentId, loadVideo]);

  /* ------------------------------------------------------------
     Handle clicking a video in the content area
  ------------------------------------------------------------ */
  function handleSelect(item) {
    const id = item.id || item.videoId;
    if (!id) return;

    const title = item.title || item.snippet?.title || "";
    const thumbnail =
      item.thumbnail ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      "";

    loadVideo(id, { title, thumbnail });
  }

  /* ------------------------------------------------------------
     Render
  ------------------------------------------------------------ */
  return (
    <div style={{ padding: "12px", color: "#fff" }}>

      {/* ⭐ Autonext Source Selector */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          marginTop: "12px",
          justifyContent: "center"
        }}
      >
        {["trending", "related", "playlist"].map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setSource(mode);
              if (mode === "playlist" && !activePlaylistId && playlists.length > 0) {
                setActivePlaylistId(playlists[0].id);
              }
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background:
                source === mode
                  ? "linear-gradient(90deg, #ff8c00, #ff4500, #ff0000)"
                  : "#333",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* ⭐ Playlist selector */}
      {source === "playlist" && playlists.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            overflowX: "auto"
          }}
        >
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => setActivePlaylistId(pl.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background:
                  activePlaylistId === pl.id
                    ? "linear-gradient(90deg, #ff8c00, #ff4500, #ff0000)"
                    : "#333",
                color: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {pl.name}
            </button>
          ))}
        </div>
      )}

      {/* ⭐ Content Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {items.map((item) => {
          const id = item.id || item.videoId;
          const thumb =
            item.thumbnail ||
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url;

          return (
            <div
              key={id}
              onClick={() => handleSelect(item)}
              style={{
                cursor: "pointer",
                background: "#111",
                padding: "8px",
                borderRadius: "8px"
              }}
            >
              <img
                src={thumb}
                alt=""
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "8px"
                }}
              />

              <div style={{ fontSize: "15px", fontWeight: 600 }}>
                {item.title || item.snippet?.title}
              </div>

              <div style={{ fontSize: "13px", opacity: 0.7 }}>
                {item.channelTitle || item.snippet?.channelTitle}
              </div>

              {/* ⭐ Add to Playlist */}
              <AddToPlaylistButton video={item} />
            </div>
          );
        })}
      </div>

      {/* ⭐ Debug overlay */}
      <DebugOverlay />
    </div>
  );
}
