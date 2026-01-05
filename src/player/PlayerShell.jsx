/**
 * File: PlayerShell.jsx
 * Path: src/player/PlayerShell.jsx
 */

console.log("PlayerShell.jsx → FILE LOADED");
window.bootDebug?.player("PlayerShell.jsx → FILE LOADED");

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "./PlayerContext.jsx";
import { usePlaylists } from "../contexts/PlaylistContext.jsx";

import { GlobalPlayer } from "./GlobalPlayerFix.js";
import { AutonextEngine } from "./AutonextEngine.js";

import { fetchVideo, fetchRelated, fetchTrending } from "../api/YouTubeAPI.js";
import normalizeId from "../utils/normalizeId.js";

import MiniPlayer from "./MiniPlayer.jsx";
import FullPlayer from "./FullPlayer.jsx";

/* ------------------------------------------------------------
   Shared pill-style button
------------------------------------------------------------- */
const pillButton = {
  padding: "4px 10px",
  fontSize: "11px",
  borderRadius: "999px",
  background: "linear-gradient(90deg, #ff8c00, #ff4500, #ff0000)",
  color: "#fff",
  border: "none",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
  transition: "transform 0.15s ease"
};

export default function PlayerShell() {
  const {
    activeVideoId,
    autonextMode,
    setAutonextMode,
    activePlaylistId,
    setActivePlaylistId,
    isExpanded,
    expandPlayer,
    collapsePlayer,
    playerMeta,
    setPlayerMeta,
    setPlayerHeight,
    loadVideo
  } = usePlayer();

  const { playlists, openAddToPlaylist } = usePlaylists();

  const [videoData, setVideoData] = useState(null);
  const [related, setRelated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [uiTick, setUiTick] = useState(0);

  const showSourceMenuRef = useRef(false);
  const showPlaylistPickerRef = useRef(false);

  if (!activeVideoId) return null;

  const height = isExpanded ? 260 : 48;

  useEffect(() => {
    setPlayerHeight(height);
  }, [height, setPlayerHeight]);

  useEffect(() => {
    try {
      GlobalPlayer.init();
      window.bootDebug?.player("PlayerShell → GlobalPlayer.init() OK");
    } catch (err) {
      window.bootDebug?.player("PlayerShell → GlobalPlayer.init() FAILED");
      console.warn(err);
    }
  }, []);

  function openSourceMenu() {
    showSourceMenuRef.current = true;
    setUiTick((x) => x + 1);
  }

  function closeSourceMenu() {
    showSourceMenuRef.current = false;
    setUiTick((x) => x + 1);
  }

  function openPlaylistPicker() {
    showPlaylistPickerRef.current = true;
    setUiTick((x) => x + 1);
  }

  function closePlaylistPicker() {
    showPlaylistPickerRef.current = false;
    setUiTick((x) => x + 1);
  }

  /* ------------------------------------------------------------
     Load metadata + related + trending (global)
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!activeVideoId) return;

    async function loadAll() {
      const video = await fetchVideo(activeVideoId);
      setVideoData(video);

      setPlayerMeta({
        title: video?.snippet?.title ?? "",
        thumbnail: video?.snippet?.thumbnails?.medium?.url ?? "",
        channel: video?.snippet?.channelTitle ?? ""
      });

      const rel = await fetchRelated(activeVideoId);
      setRelated(rel);

      const trend = await fetchTrending("US");
      setTrending(trend);
    }

    loadAll();
  }, [activeVideoId, uiTick, setPlayerMeta]);

  /* ------------------------------------------------------------
     Playlist hydration
  ------------------------------------------------------------ */
  useEffect(() => {
    if (autonextMode !== "playlist") return;
    if (!activePlaylistId) return;

    const pl = playlists.find((p) => p.id === activePlaylistId);
    if (!pl) return;

    async function hydrate() {
      let changed = false;

      for (const item of pl.videos) {
        if (!item.snippet) {
          const meta = await fetchVideo(item.id);
          if (meta?.snippet) {
            item.snippet = meta.snippet;
            changed = true;
          }
        }
      }

      if (changed) {
        setUiTick((x) => x + 1);
      }
    }

    hydrate();
  }, [autonextMode, activePlaylistId, playlists]);

  /* ------------------------------------------------------------
     Autonext callback registration (global)
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!activeVideoId) return;

    if (autonextMode === "playlist" && activePlaylistId) {
      const playlistHandler = () => {
        const playlist = playlists.find((p) => p.id === activePlaylistId);
        if (!playlist) return;

        const index = playlist.videos.findIndex((v) => v.id === activeVideoId);
        if (index === -1) return;

        const nextIndex = (index + 1) % playlist.videos.length;
        const nextVideo = playlist.videos[nextIndex];

        const nextId = normalizeId(nextVideo);
        if (!nextId) return;

        loadVideo(nextId);

        setPlayerMeta({
          title: nextVideo.snippet?.title ?? "",
          thumbnail: nextVideo.snippet?.thumbnails?.medium?.url ?? "",
          channel: nextVideo.snippet?.channelTitle ?? ""
        });

        expandPlayer();
      };

      AutonextEngine.registerPlaylistCallback(playlistHandler);
      AutonextEngine.registerRelatedCallback(null);

      return () => {
        AutonextEngine.registerPlaylistCallback(null);
        AutonextEngine.registerRelatedCallback(null);
      };
    }

    if (autonextMode === "related") {
      const relatedHandler = () => {
        if (!related.length) return;

        const next = related[0];
        const vidId = normalizeId(next);
        if (!vidId) return;

        loadVideo(vidId);

        setPlayerMeta({
          title: next.snippet?.title ?? "",
          thumbnail: next.snippet?.thumbnails?.medium?.url ?? "",
          channel: next.snippet?.channelTitle ?? ""
        });

        expandPlayer();
      };

      AutonextEngine.registerPlaylistCallback(null);
      AutonextEngine.registerRelatedCallback(relatedHandler);

      return () => {
        AutonextEngine.registerPlaylistCallback(null);
        AutonextEngine.registerRelatedCallback(null);
      };
    }

    if (autonextMode === "trending") {
      const trendingHandler = () => {
        if (!trending.length) return;

        const next = trending[0];
        const vidId = normalizeId(next);
        if (!vidId) return;

        loadVideo(vidId);

        setPlayerMeta({
          title: next.snippet?.title ?? "",
          thumbnail: next.snippet?.thumbnails?.medium?.url ?? "",
          channel: next.snippet?.channelTitle ?? ""
        });

        expandPlayer();
      };

      AutonextEngine.registerPlaylistCallback(null);
      AutonextEngine.registerRelatedCallback(trendingHandler);

      return () => {
        AutonextEngine.registerPlaylistCallback(null);
        AutonextEngine.registerRelatedCallback(null);
      };
    }
  }, [
    activeVideoId,
    autonextMode,
    activePlaylistId,
    playlists,
    related,
    trending,
    setPlayerMeta,
    expandPlayer,
    loadVideo
  ]);

  /* ------------------------------------------------------------
     Autonext list + title (global)
  ------------------------------------------------------------ */
  const relatedList = useMemo(() => {
    if (autonextMode === "playlist" && activePlaylistId) {
      const pl = playlists.find((p) => p.id === activePlaylistId);
      return pl ? pl.videos : [];
    }

    if (autonextMode === "related") {
      return related;
    }

    if (autonextMode === "trending") {
      return trending;
    }

    return [];
  }, [autonextMode, activePlaylistId, playlists, related, trending]);

  const relatedTitle = useMemo(() => {
    if (autonextMode === "playlist" && activePlaylistId) {
      const pl = playlists.find((p) => p.id === activePlaylistId);
      return pl ? pl.name : "Playlist";
    }
    if (autonextMode === "trending") return "Trending";
    return "Related";
  }, [autonextMode, activePlaylistId, playlists]);

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  };

  const menuStyle = {
    background: "#111827",
    padding: "16px",
    borderRadius: "12px",
    width: "260px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
  };

  const menuButton = {
    width: "100%",
    padding: "8px 10px",
    marginBottom: "8px",
    borderRadius: "999px",
    border: "none",
    background: "#1f2937",
    color: "#fff",
    textAlign: "left",
    fontSize: "14px",
    cursor: "pointer"
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#000",
        position: "fixed",
        top: "60px",
        left: 0,
        right: 0,
        zIndex: 900,
        transition: "height 0.25s ease",
        height,
        overflow: "hidden",
        borderBottom: "1px solid #222"
      }}
    >
      {isExpanded && (
        <FullPlayer onCollapse={collapsePlayer} meta={playerMeta} />
      )}

      {!isExpanded && (
        <MiniPlayer meta={playerMeta} onExpand={expandPlayer} />
      )}

      {/* Autonext Source Menu */}
      {showSourceMenuRef.current && (
        <div style={overlayStyle} onClick={closeSourceMenu}>
          <div style={menuStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>
              Autonext Source
            </h3>

            <button
              style={menuButton}
              onClick={() => {
                setAutonextMode("related");
                closeSourceMenu();
              }}
            >
              Related
            </button>

            <button
              style={menuButton}
              onClick={() => {
                closeSourceMenu();
                openPlaylistPicker();
              }}
            >
              Playlist...
            </button>

            <button
              style={menuButton}
              onClick={() => {
                setAutonextMode("trending");
                closeSourceMenu();
              }}
            >
              Trending
            </button>
          </div>
        </div>
      )}

      {/* Playlist Picker */}
      {showPlaylistPickerRef.current && (
        <div style={overlayStyle} onClick={closePlaylistPicker}>
          <div style={menuStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>
              Choose Playlist
            </h3>

            {playlists.length === 0 && (
              <div style={{ fontSize: "13px", opacity: 0.7 }}>
                No playlists yet.
              </div>
            )}

            {playlists.map((pl) => (
              <button
                key={pl.id}
                style={menuButton}
                onClick={() => {
                  setActivePlaylistId(pl.id);
                  setAutonextMode("playlist");
                  closePlaylistPicker();
                }}
              >
                {pl.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Global Autonext Controls + List (only when expanded and metadata ready) */}
      {isExpanded && videoData && (
        <div style={{ padding: "4px 16px 12px 16px", color: "#fff" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "10px",
              alignItems: "center"
            }}
          >
            <button
              onClick={openSourceMenu}
              style={pillButton}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.94)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              Autonext: {autonextMode}
            </button>

            <button
              onClick={() =>
                openAddToPlaylist({
                  id: activeVideoId,
                  title: videoData?.snippet?.title,
                  thumbnail:
                    videoData?.snippet?.thumbnails?.medium?.url
                })
              }
              style={pillButton}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.94)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              + Add to playlist
            </button>
          </div>

          {relatedList.length > 0 && (
            <div style={{ marginTop: "2px" }}>
              <h3 style={{ fontSize: "14px", marginBottom: "8px" }}>
                {relatedTitle}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                {relatedList.map((item) => {
                  const vidId = normalizeId(item);
                  if (!vidId) return null;

                  const thumb = item.snippet?.thumbnails?.medium?.url;
                  const title = item.snippet?.title;

                  return (
                    <div
                      key={vidId}
                      style={{
                        display: "flex",
                        gap: "8px",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        loadVideo(vidId);

                        setPlayerMeta({
                          title: item.snippet?.title ?? "",
                          thumbnail:
                            item.snippet?.thumbnails?.medium?.url ?? "",
                          channel: item.snippet?.channelTitle ?? ""
                        });

                        expandPlayer();
                      }}
                    >
                      <img
                        src={thumb}
                        alt={title}
                        style={{
                          width: "160px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            opacity: 0.7
                          }}
                        >
                          {item.snippet?.channelTitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
