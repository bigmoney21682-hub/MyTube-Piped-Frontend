// File: src/pages/Watch.jsx
// PCC v17.0 — Fallback metadata + Subscribe inline + global player

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DebugOverlay from "../components/DebugOverlay";
import Player from "../components/Player";
import RelatedVideos from "../components/RelatedVideos";

import { usePlayer } from "../contexts/PlayerContext";
import { getCached, setCached } from "../utils/youtubeCache";
import { useSubscriptions } from "../hooks/useSubscriptions";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    playVideo,
    playing,
    setAutonextMode,
    setRelatedList,
    setPlaylist,
    setCurrentIndex,
  } = usePlayer();

  const { subscribe, unsubscribe, isSubscribed } = useSubscriptions();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sourceUsed, setSourceUsed] = useState(null);

  const log = (msg) => window.debugLog?.(`Watch: ${msg}`);

  async function fetchFromYouTube(videoId) {
    const apiKey = window.YT_API_KEY;
    const cacheKey = `video_${videoId}`;

    const cached = getCached(cacheKey);
    if (cached) {
      setSourceUsed("CACHE");
      return cached;
    }

    try {
      const url =
        "https://www.googleapis.com/youtube/v3/videos" +
        `?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.items || !data.items.length) {
        log("Metadata failed — using fallback object");
        return {
          id: videoId,
          snippet: {
            title: "Unknown Title",
            channelTitle: "Unknown Channel",
            channelId: "unknown",
            description: "",
            thumbnails: {},
          },
        };
      }

      const item = data.items[0];
      setCached(cacheKey, item);
      setSourceUsed("YOUTUBE_API");
      return item;
    } catch (err) {
      log("Metadata fetch error — using fallback");
      return {
        id: videoId,
        snippet: {
          title: "Unknown Title",
          channelTitle: "Unknown Channel",
          channelId: "unknown",
          description: "",
          thumbnails: {},
        },
      };
    }
  }

  const normalizeVideo = (v) => {
    return {
      id: typeof v.id === "string" ? v.id : v.id.videoId,
      title: v.snippet.title,
      author: v.snippet.channelTitle,
      channelId: v.snippet.channelId,
      description: v.snippet.description,
      thumbnail: null,
      youtube: v,
    };
  };

  useEffect(() => {
    async function load() {
      const cleanId = String(id || "").trim();
      if (!cleanId) {
        setVideo(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const raw = await fetchFromYouTube(cleanId);
      const normalized = normalizeVideo(raw);

      setVideo(normalized);

      setPlaylist([normalized]);
      setCurrentIndex(0);
      setAutonextMode("related");
      playVideo(normalized);

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <DebugOverlay pageName="Watch" sourceUsed={sourceUsed} />
        <p style={{ color: "#fff", padding: 16 }}>Loading…</p>
      </>
    );
  }

  if (!video) {
    return (
      <>
        <DebugOverlay pageName="Watch" sourceUsed={sourceUsed} />
        <p style={{ color: "#fff", padding: 16 }}>Unable to load this video.</p>
      </>
    );
  }

  const subscribed = isSubscribed(video.channelId);

  return (
    <>
      <DebugOverlay pageName="Watch" sourceUsed={sourceUsed} />

      <div style={{ padding: 16, color: "#fff" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            borderRadius: 12,
            overflow: "hidden",
            background: "#000",
            marginBottom: 16,
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <Player playing={playing} />
          </div>
        </div>

        <h2 style={{ marginBottom: 8 }}>{video.title}</h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              onClick={() =>
                navigate(`/channel/${video.channelId}`, {
                  state: {
                    channelTitle: video.author,
                    channelThumb: video.thumbnail,
                  },
                })
              }
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {video.author}
            </button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate("/playlists")}
              style={{
                padding: "6px 10px",
                background: "#222",
                borderRadius: 999,
                border: "1px solid #444",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              + Playlist
            </button>

            <button
              onClick={() => {
                if (subscribed) {
                  unsubscribe(video.channelId);
                } else {
                  subscribe({
                    channelId: video.channelId,
                    title: video.author,
                    thumbnail: video.thumbnail,
                  });
                }
              }}
              style={{
                padding: "6px 12px",
                background: subscribed ? "#444" : "#ff0000",
                borderRadius: 999,
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        <RelatedVideos
          videoId={video.id}
          title={video.title}
          onLoaded={(list) => setRelatedList(list || [])}
        />
      </div>
    </>
  );
}
