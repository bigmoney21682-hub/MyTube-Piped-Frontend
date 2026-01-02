/**
 * File: src/pages/Watch/Watch.jsx
 * Description:
 *   Restored Watch page with:
 *   - YouTube API loader
 *   - GlobalPlayer integration
 *   - Playlist + Related + Trending autonext
 *   - Autonext source popup (Playlist / Related / Trending)
 *   - Playlist picker when Playlist is chosen
 *   - Add to playlist
 *   - Related/Playlist/Trending list with safe fallback
 */

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { usePlayer } from "../../player/PlayerContext.jsx";
import { AutonextEngine } from "../../player/AutonextEngine.js";
import { GlobalPlayer } from "../../player/GlobalPlayer.js";

import { usePlaylists } from "../../contexts/PlaylistContext.jsx";
import { debugBus } from "../../debug/debugBus.js";

const YT_API_KEY = "AIzaSyA-TNtGohJAO_hsZW6zp9FcSOdfGV7VJW0";

export default function Watch() {
  // ------------------------------------------------------------
  // 1. Route + query params
  // ------------------------------------------------------------
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const rawId = params.id;

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const srcParam = searchParams.get("src"); // "playlist" | "related" | "trending" | null
  const playlistIdFromURL = searchParams.get("pl");

  const id = useMemo(() => {
    if (!rawId) return "";
    if (typeof rawId === "string") return rawId;
    if (rawId.videoId) return rawId.videoId;
    if (rawId.id) return rawId.id;
    return String(rawId);
  }, [rawId]);

  const isPlaylistMode = Boolean(playlistIdFromURL);

  // ------------------------------------------------------------
  // 2. Contexts
  // ------------------------------------------------------------
  const { loadVideo, setAutonextMode, setActivePlaylistId } = usePlayer();
  const { playlists, openAddToPlaylist } = usePlaylists();

  // ------------------------------------------------------------
  // 3. Local state
  // ------------------------------------------------------------
  const [videoData, setVideoData] = useState(null);
  const [related, setRelated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(
    playlistIdFromURL || null
  );

  // "playlist" | "related" | "trending"
  const [autonextSource, setAutonextSource] = useState(
    isPlaylistMode ? "playlist" : "related"
  );

  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

  // Keep autonextSource in sync when route changes
  useEffect(() => {
    setAutonextSource((prev) => {
      if (prev === "playlist" && !isPlaylistMode && !selectedPlaylistId) {
        return "related";
      }
      return prev;
    });
  }, [isPlaylistMode, selectedPlaylistId]);

  // ------------------------------------------------------------
  // 4. YouTube API loader
  // ------------------------------------------------------------
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      debugBus.log("YT API already loaded (Watch.jsx)");
      GlobalPlayer.onApiReady();
      return;
    }

    debugBus.log("Injecting YouTube API script (Watch.jsx)");

    const existing = document.getElementById("youtube-iframe-api");
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-iframe-api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      debugBus.log("YouTube API ready (Watch.jsx callback)");
      GlobalPlayer.onApiReady();
    };
  }, []);

  // ------------------------------------------------------------
  // 5. Autonext mode in PlayerContext (for global awareness)
  // ------------------------------------------------------------
  useEffect(() => {
    if (autonextSource === "playlist" && (selectedPlaylistId || playlistIdFromURL)) {
      setAutonextMode("playlist");
      setActivePlaylistId(selectedPlaylistId || playlistIdFromURL);
    } else if (autonextSource === "related") {
      setAutonextMode("related");
      setActivePlaylistId(null);
    } else if (autonextSource === "trending") {
      setAutonextMode("related"); // treat as non-playlist for context
      setActivePlaylistId(null);
    }
  }, [
    autonextSource,
    selectedPlaylistId,
    playlistIdFromURL,
    setAutonextMode,
    setActivePlaylistId
  ]);

  // ------------------------------------------------------------
  // 6. Load video into GlobalPlayer
  // ------------------------------------------------------------
  useEffect(() => {
    if (!id) return;
    debugBus.log("Watch.jsx → load(" + id + ")");
    loadVideo(id);
  }, [id, loadVideo]);

  // ------------------------------------------------------------
  // 7. Fetch video + related + trending
  // ------------------------------------------------------------
  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        // Video details
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${YT_API_KEY}`
        );
        const videoJson = await videoRes.json();
        setVideoData(videoJson.items?.[0] || null);

        // Related
        let relatedItems = [];
        try {
          const relatedRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=${id}&videoEmbeddable=true&maxResults=20&key=${YT_API_KEY}`
          );
          const relatedJson = await relatedRes.json();

          if (relatedJson.error || !Array.isArray(relatedJson.items)) {
            throw new Error("Related API error");
          }

          relatedItems = relatedJson.items;
        } catch (innerErr) {
          debugBus.warn(
            "Watch.jsx → related search failed, will rely on trending"
          );
        }

        setRelated(relatedItems);

        // Trending (always fetch, used for Trending source and fallback)
        try {
          const trendingRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=US&key=${YT_API_KEY}`
          );
          const trendingJson = await trendingRes.json();
          setTrending(trendingJson.items || []);
        } catch (trendErr) {
          debugBus.error("Watch.jsx trending fetch error", trendErr);
        }
      } catch (err) {
        debugBus.error("Watch.jsx fetch error", err);
      }
    }

    fetchData();
  }, [id]);

  // ------------------------------------------------------------
  // 8. Autonext lifecycle (playlist + related + trending, source-aware)
  // ------------------------------------------------------------
  useEffect(() => {
    const effectivePlaylistId = selectedPlaylistId || playlistIdFromURL || null;

    const playlistHandler = () => {
      if (autonextSource !== "playlist") return;
      if (!effectivePlaylistId) return;

      const playlist = playlists.find((p) => p.id === effectivePlaylistId);
      if (!playlist) return;

      const index = playlist.videos.findIndex((v) => v.id === id);
      if (index === -1) return;

      const nextIndex = (index + 1) % playlist.videos.length;
      const nextVideo = playlist.videos[nextIndex];

      navigate(`/watch/${nextVideo.id}?src=playlist&pl=${effectivePlaylistId}`);
    };

    const relatedHandler = () => {
      if (autonextSource === "related") {
        const list = related;
        if (!list.length) return;

        const next = list[0];
        const vidId = next.id?.videoId || next.id;
        if (!vidId) return;

        navigate(`/watch/${vidId}?src=related`);
        return;
      }

      if (autonextSource === "trending") {
        const list = trending;
        if (!list.length) return;

        const next = list[0];
        const vidId = next.id?.videoId || next.id;
        if (!vidId) return;

        navigate(`/watch/${vidId}?src=trending`);
        return;
      }
    };

    AutonextEngine.registerPlaylistCallback(playlistHandler);
    AutonextEngine.registerRelatedCallback(relatedHandler);

    return () => {
      AutonextEngine.registerPlaylistCallback(null);
      AutonextEngine.registerRelatedCallback(null);
    };
  }, [
    id,
    related,
    trending,
    playlists,
    playlistIdFromURL,
    selectedPlaylistId,
    autonextSource,
    navigate
  ]);

  // ------------------------------------------------------------
  // 9. Derived lists and labels
  // ------------------------------------------------------------
  const effectivePlaylistId = selectedPlaylistId || playlistIdFromURL || null;

  const relatedList = useMemo(() => {
    if (autonextSource === "playlist" && effectivePlaylistId) {
      const pl = playlists.find((p) => p.id === effectivePlaylistId);
      return pl ? pl.videos : [];
    }
    if (autonextSource === "trending") {
      return trending;
    }
    return related;
  }, [autonextSource, effectivePlaylistId, playlists, related, trending]);

  const relatedTitle = useMemo(() => {
    if (autonextSource === "playlist" && effectivePlaylistId) {
      const pl = playlists.find((p) => p.id === effectivePlaylistId);
      return pl ? pl.name : "Playlist";
    }
    if (autonextSource === "trending") return "Trending";
    return "Related";
  }, [autonextSource, effectivePlaylistId, playlists]);

  const currentOriginLabel = useMemo(() => {
    if (effectivePlaylistId) return "Playlist";
    if (srcParam === "related") return "Related";
    if (srcParam === "trending") return "Trending";
    return "Trending";
  }, [effectivePlaylistId, srcParam]);

  const sourceLabel = useMemo(() => {
    if (autonextSource === "playlist") return "Playlist";
    if (autonextSource === "trending") return "Trending";
    return "Related";
  }, [autonextSource]);

  // ------------------------------------------------------------
  // 10. UI helpers
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // 11. UI
  // ------------------------------------------------------------
  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      {/* Autonext source menu */}
      {showSourceMenu && (
        <div style={overlayStyle} onClick={() => setShowSourceMenu(false)}>
          <div
            style={menuStyle}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>
              Autonext Source
            </h3>

            <button
              style={menuButton}
              onClick={() => {
                setAutonextSource("related");
                setShowSourceMenu(false);
              }}
            >
              Related
            </button>

            <button
              style={menuButton}
              onClick={() => {
                setShowSourceMenu(false);
                setShowPlaylistPicker(true);
              }}
            >
              Playlist…
            </button>

            <button
              style={menuButton}
              onClick={() => {
                setAutonextSource("trending");
                setShowSourceMenu(false);
              }}
            >
              Trending
            </button>
          </div>
        </div>
      )}

      {/* Playlist picker */}
      {showPlaylistPicker && (
        <div style={overlayStyle} onClick={() => setShowPlaylistPicker(false)}>
          <div
            style={menuStyle}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
                  setSelectedPlaylistId(pl.id);
                  setAutonextSource("playlist");
                  setShowPlaylistPicker(false);
                }}
              >
                {pl.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Player */}
      <div
        id="player"
        style={{
          width: "100%",
          height: "220px",
          background: "#000",
          marginBottom: "12px"
        }}
      />

      {/* Video meta */}
      {videoData && (
        <div style={{ marginBottom: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
            {videoData.snippet.title}
          </h2>
          <div style={{ opacity: 0.7, fontSize: "13px" }}>
            {videoData.snippet.channelTitle}
          </div>
        </div>
      )}

      {/* Controls row */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <button
          onClick={() => setShowSourceMenu(true)}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            background: "#22c55e",
            color: "#fff"
          }}
        >
          Autonext: {sourceLabel}
        </button>

        <button
          onClick={() =>
            openAddToPlaylist({
              id,
              title: videoData?.snippet?.title,
              thumbnail: videoData?.snippet?.thumbnails?.medium?.url
            })
          }
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            background: "#3b82f6",
            color: "#fff"
          }}
        >
          + Add to playlist
        </button>

        <span style={{ fontSize: "11px", opacity: 0.7 }}>
          Source: {currentOriginLabel}
        </span>
      </div>

      {/* Related / Playlist / Trending list */}
      {relatedList.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "8px" }}>
            {relatedTitle}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {relatedList.map((item) => {
              const vidId = item.id?.videoId || item.id;
              const thumb = item.snippet?.thumbnails?.medium?.url;
              const title = item.snippet?.title;

              if (!vidId) return null;

              return (
                <div
                  key={vidId}
                  style={{ display: "flex", gap: "8px", cursor: "pointer" }}
                  onClick={() => navigate(`/watch/${vidId}?src=${autonextSource}`)}
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
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>
                      {title}
                    </div>
                    <div style={{ fontSize: "11px", opacity: 0.7 }}>
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
  );
}
