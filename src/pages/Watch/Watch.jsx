// File: src/pages/Watch/Watch.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { usePlayer } from "../../player/PlayerContext.jsx";
import { AutonextEngine } from "../../player/AutonextEngine.js";
import { GlobalPlayer } from "../../player/GlobalPlayer.js";

import { usePlaylists } from "../../contexts/PlaylistContext.jsx";
import { debugBus } from "../../debug/debugBus.js";

export default function Watch() {
  const params = useParams();
  const rawId = params.id;

  const id =
    typeof rawId === "string"
      ? rawId
      : rawId?.id || rawId?.videoId || "";

  const navigate = useNavigate();
  const location = useLocation();

  const {
    loadVideo,
    setAutonextMode,
    setActivePlaylistId
  } = usePlayer();
  const { playlists, openAddToPlaylist } = usePlaylists();

  const [videoData, setVideoData] = useState(null);
  const [related, setRelated] = useState([]);

  const hasPlaylistContext = useMemo(
    () => Boolean(new URLSearchParams(location.search).get("pl")),
    [location.search]
  );

  const [autonextEnabled, setAutonextEnabled] = useState(true);

  useEffect(() => {
    GlobalPlayer.ensureMounted();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const src = params.get("src");
    const pl = params.get("pl");

    if (src === "playlist" && pl) {
      setAutonextMode("playlist");
      setActivePlaylistId(pl);
      debugBus.log("Mode set → playlist");
    } else {
      setAutonextMode("related");
      setActivePlaylistId(null);
      debugBus.log("Mode set → related");
    }
  }, [location.search, setAutonextMode, setActivePlaylistId]);

  useEffect(() => {
    if (!id) return;
    debugBus.log("Watch.jsx → load(" + id + ")");
    loadVideo(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=AIzaSyA-TNtGohJAO_hsZW6zp9FcSOdfGV7VJW0`
        );
        const videoJson = await videoRes.json();
        setVideoData(videoJson.items?.[0] || null);

        const relatedRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=US&key=AIzaSyA-TNtGohJAO_hsZW6zp9FcSOdfGV7VJW0`
        );

        if (!relatedRes.ok) {
          setRelated([]);
          return;
        }

        const relatedJson = await relatedRes.json();
        setRelated(relatedJson.items || []);
      } catch {
        setRelated([]);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    AutonextEngine.registerPlaylistCallback(() => {
      if (!autonextEnabled) return;

      const params = new URLSearchParams(location.search);
      const activePlaylistId = params.get("pl");

      if (!activePlaylistId) return;

      const playlist = playlists.find((p) => p.id === activePlaylistId);
      if (!playlist || !playlist.videos.length) return;

      const index = playlist.videos.findIndex((v) => v.id === id);
      if (index === -1) return;

      const nextIndex = (index + 1) % playlist.videos.length;
      const nextVideo = playlist.videos[nextIndex];

      navigate(`/watch/${nextVideo.id}?src=playlist&pl=${activePlaylistId}`);
      loadVideo(nextVideo.id);
    });
  }, [navigate, loadVideo, playlists, id, location.search, autonextEnabled]);

  useEffect(() => {
    AutonextEngine.registerRelatedCallback(() => {
      if (!autonextEnabled) return;
      if (!related.length) return;

      const next = related[0];
      const nextId = next?.id;

      if (!nextId) return;

      navigate(`/watch/${nextId}?src=related`);
      loadVideo(nextId);
    });
  }, [related, navigate, loadVideo, autonextEnabled]);

  const handleToggleAutonext = () => {
    const next = !autonextEnabled;
    setAutonextEnabled(next);
    debugBus.log("Watch.jsx → Autonext " + (next ? "enabled" : "disabled"));
  };

  const handleAddToPlaylist = () => {
    if (!id || !videoData) return;
    debugBus.log("Watch.jsx → Add to playlist " + id);

    openAddToPlaylist({
      id,
      title: videoData.snippet.title,
      thumbnail: videoData.snippet.thumbnails?.medium?.url
    });
  };

  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      <div
        id="player"
        style={{
          width: "100%",
          height: "220px",
          background: "#000",
          marginBottom: "12px"
        }}
      />

      {videoData && (
        <div style={{ marginBottom: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
            {videoData.snippet.title}
          </h2>
          <div style={{ opacity: 0.7, marginTop: "4px", fontSize: "13px" }}>
            {videoData.snippet.channelTitle}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px"
        }}
      >
        <button
          onClick={handleToggleAutonext}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            fontSize: "13px",
            background: autonextEnabled ? "#22c55e" : "#4b5563",
            color: "#fff"
          }}
        >
          Autonext: {autonextEnabled ? "On" : "Off"}
        </button>

        <button
          onClick={handleAddToPlaylist}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            fontSize: "13px",
            background: "#3b82f6",
            color: "#fff"
          }}
        >
          + Add to playlist
        </button>

        {hasPlaylistContext && (
          <span style={{ fontSize: "11px", opacity: 0.7 }}>
            Playlist mode active
          </span>
        )}
      </div>

      <h3 style={{ marginBottom: "10px" }}>Related Videos</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {related.map((item) => {
          const vid = item.id;
          if (!vid) return null;

          return (
            <div
              key={vid}
              onClick={() => navigate(`/watch/${vid}?src=related`)}
              style={{
                display: "flex",
                gap: "12px",
                cursor: "pointer"
              }}
            >
              <img
                src={item.snippet.thumbnails.medium.url}
                alt=""
                style={{
                  width: "140px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px"
                }}
              />
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>
                  {item.snippet.title}
                </div>
                <div
                  style={{
                    opacity: 0.7,
                    fontSize: "12px",
                    marginTop: "2px"
                  }}
                >
                  {item.snippet.channelTitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
