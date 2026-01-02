/**
 * File: Watch.jsx
 * Path: src/pages/Watch/Watch.jsx
 */

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";

import { usePlayer } from "../../player/PlayerContext.jsx";
import { AutonextEngine } from "../../player/AutonextEngine.js";
import { GlobalPlayer } from "../../player/GlobalPlayer.js";
import { debugBus } from "../../debug/debugBus.js";

import { updateMediaSessionMetadata } from "../../main.jsx";
import { getVideoDetails } from "../../api/video.js";
import { fetchRelatedVideos } from "../../api/related.js";
import { usePlaylists } from "../../contexts/PlaylistContext.jsx";

import PlaylistPickerModal from "../../components/PlaylistPickerModal.jsx";
import VideoActions from "../../components/VideoActions.jsx";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const src = params.get("src");
  const playlistIdFromNav = params.get("pl");

  const player = usePlayer() ?? {};
  const loadVideo = player.loadVideo ?? (() => {});
  const queueAdd = player.queueAdd ?? (() => {});
  const autonextMode = player.autonextMode ?? "related";
  const setAutonextMode = player.setAutonextMode ?? (() => {});
  const activePlaylistId = player.activePlaylistId;
  const setActivePlaylistId = player.setActivePlaylistId;

  const { playlists, addVideoToPlaylist } = usePlaylists() ?? {
    playlists: [],
    addVideoToPlaylist: () => {}
  };

  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const relatedRef = useRef([]);
  useEffect(() => {
    relatedRef.current = related;
  }, [related]);

  /* ------------------------------------------------------------
     ⭐ Mount the YouTube player ONLY when Watch.jsx is visible
  ------------------------------------------------------------- */
  useEffect(() => {
    const el = document.getElementById("player");
    if (el) {
      debugBus.log("PLAYER", "Watch.jsx → ensureMounted()");
      GlobalPlayer.ensureMounted();
    }
  }, []);

  /* ------------------------------------------------------------
     Autonext mode from URL
  ------------------------------------------------------------- */
  useEffect(() => {
    if (src === null) return;

    if (src === "playlist") {
      setAutonextMode("playlist");
      AutonextEngine.setMode("playlist");

      if (playlistIdFromNav) {
        setActivePlaylistId(playlistIdFromNav);
      }
    } else {
      setAutonextMode("related");
      AutonextEngine.setMode("related");
    }
  }, [src, playlistIdFromNav]);

  /* ------------------------------------------------------------
     Load video + related
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    debugBus.log("PLAYER", `Watch.jsx → loadVideo(${id})`);
    loadVideo(id);

    loadVideoDetails(id);
    loadRelated(id);
  }, [id, loadVideo]);

  /* ------------------------------------------------------------
     Autonext: Related
  ------------------------------------------------------------- */
  useEffect(() => {
    AutonextEngine.registerRelatedCallback(() => {
      const list = relatedRef.current;
      if (!list.length) return;

      const next = list[0]?.id;
      if (!next) return;

      navigate(`/watch/${next}?src=related`);
      loadVideo(next);
    });
  }, [navigate, loadVideo]);

  /* ------------------------------------------------------------
     Autonext: Playlist
  ------------------------------------------------------------- */
  useEffect(() => {
    AutonextEngine.registerPlaylistCallback(() => {
      if (!activePlaylistId) return;

      const playlist = playlists.find((p) => p.id === activePlaylistId);
      if (!playlist || !playlist.videos.length) return;

      const index = playlist.videos.findIndex((v) => v.id === id);
      const nextIndex = (index + 1) % playlist.videos.length;
      const nextVideo = playlist.videos[nextIndex];

      navigate(`/watch/${nextVideo.id}?src=playlist&pl=${activePlaylistId}`);
      loadVideo(nextVideo.id);
    });
  }, [navigate, loadVideo, playlists, activePlaylistId, id]);

  /* ------------------------------------------------------------
     Load video details
  ------------------------------------------------------------- */
  async function loadVideoDetails(videoId) {
    try {
      const details = await getVideoDetails(videoId);
      if (!details) return setVideo(null);

      setVideo({
        snippet: {
          title: details.title,
          description: details.description,
          channelId: details.channelId,
          channelTitle: details.channelTitle,
          publishedAt: details.publishedAt,
          thumbnails: details.thumbnails
        },
        statistics: details.statistics
      });
    } catch {
      setVideo(null);
    }
  }

  /* ------------------------------------------------------------
     Load related
  ------------------------------------------------------------- */
  async function loadRelated(videoId) {
    try {
      const list = await fetchRelatedVideos(videoId);
      if (!Array.isArray(list)) return setRelated([]);

      setRelated(
        list.map((item) => ({
          id: item.id,
          snippet: {
            title: item.title,
            channelTitle: item.author,
            description: "",
            thumbnails: { medium: { url: item.thumbnail } }
          }
        }))
      );
    } catch {
      setRelated([]);
    }
  }

  /* ------------------------------------------------------------
     Media Session
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!video || !id) return;

    const sn = video.snippet ?? {};
    updateMediaSessionMetadata({
      title: sn.title ?? "Untitled",
      artist: sn.channelTitle ?? "Unknown Channel",
      artwork: sn.thumbnails?.medium?.url ?? ""
    });
  }, [video, id]);

  /* ------------------------------------------------------------
     Add to playlist
  ------------------------------------------------------------- */
  function handleAddToPlaylist() {
    if (!id) return;

    if (!playlists.length) {
      alert("You have no playlists yet.");
      return;
    }

    setShowPicker(true);
  }

  const sn = video?.snippet ?? {};
  const title = sn.title ?? "Loading…";
  const description = sn.description ?? "";

  return (
    <div
      style={{
        paddingBottom: "80px",
        color: "#fff",
        marginTop: "calc(56.25vw + var(--header-height))"
      }}
    >
      {/* Player container */}
      <div
        style={{
          position: "fixed",
          top: "var(--header-height)",
          left: 0,
          width: "100%",
          height: "56.25vw",
          background: "#000",
          zIndex: 10
        }}
      >
        <div
          id="player"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
        ></div>
      </div>

      {/* Title */}
      <h2 style={{ padding: "16px" }}>{title}</h2>

      {/* Description */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            opacity: 0.85,
            lineHeight: 1.4,
            maxHeight: descExpanded ? "none" : "3.6em",
            overflow: "hidden"
          }}
        >
          {description}
        </div>

        <button
          onClick={() => setDescExpanded(!descExpanded)}
          style={{
            marginTop: "6px",
            background: "none",
            border: "none",
            color: "#3ea6ff",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          {descExpanded ? "Show less" : "Show more"}
        </button>
      </div>

      {/* Main actions */}
      <div style={{ padding: "16px", display: "flex", gap: "8px" }}>
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

        <button
          onClick={handleAddToPlaylist}
          style={{
            padding: "10px 16px",
            background: "#222",
            color: "#3ea6ff",
            border: "1px solid #444",
            borderRadius: "4px"
          }}
        >
          + Playlist
        </button>
      </div>

      {/* Autonext */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ fontSize: "14px", marginBottom: "6px" }}>
          Autonext Mode:
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => {
              setAutonextMode("related");
              AutonextEngine.setMode("related");
            }}
            style={{
              padding: "8px 12px",
              background: autonextMode === "related" ? "#3ea6ff" : "#222",
              color: autonextMode === "related" ? "#000" : "#fff",
              border: "1px solid #444",
              borderRadius: "4px"
            }}
          >
            Related
          </button>

          <button
            onClick={() => {
              setAutonextMode("playlist");
              AutonextEngine.setMode("playlist");

              if (!activePlaylistId) setShowPicker(true);
            }}
            style={{
              padding: "8px 12px",
              background: autonextMode === "playlist" ? "#3ea6ff" : "#222",
              color: autonextMode === "playlist" ? "#000" : "#fff",
              border: "1px solid #444",
              borderRadius: "4px"
            }}
          >
            Playlist
          </button>
        </div>
      </div>

      {/* Related videos */}
      <div style={{ padding: "16px" }}>
        <h3 style={{ marginBottom: "12px" }}>Related Videos</h3>

        {related.map((item, i) => {
          const vid = item.id;
          const rsn = item.snippet;
          const thumb = rsn.thumbnails.medium.url;

          return (
            <div key={vid + "_" + i} style={{ marginBottom: "20px" }}>
              <Link to={`/watch/${vid}?src=related`}>
                <img
                  src={thumb}
                  alt={rsn.title}
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "8px"
                  }}
                />
                <div style={{ fontWeight: "bold" }}>{rsn.title}</div>
                <div style={{ opacity: 0.7 }}>{rsn.channelTitle}</div>
              </Link>

              <VideoActions videoId={vid} videoSnippet={rsn} />
            </div>
          );
        })}
      </div>

      {/* Playlist picker */}
      {showPicker && (
        <PlaylistPickerModal
          playlists={playlists}
          onSelect={(playlist) => {
            setActivePlaylistId(playlist.id);

            addVideoToPlaylist(playlist.id, {
              id,
              title: sn.title,
              author: sn.channelTitle,
              thumbnail: sn.thumbnails.medium.url
            });

            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
