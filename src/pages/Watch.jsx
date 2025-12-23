// File: src/pages/Watch.jsx
// PCC v7.0 — Invidious primary, YouTube fallback, sourceUsed debug

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DebugOverlay from "../components/DebugOverlay";
import { usePlayer } from "../contexts/PlayerContext";

const INVIDIOUS_BASE = "https://yewtu.be";

export default function Watch() {
  const { id } = useParams();
  const { playVideo } = usePlayer();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sourceUsed, setSourceUsed] = useState(null);

  const log = (msg) => window.debugLog?.(`Watch: ${msg}`);

  // Invidious video details
  async function fetchFromInvidious(id) {
    const url = `${INVIDIOUS_BASE}/api/v1/videos/${id}`;
    log(`Trying Invidious: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      log(`Invidious failed: ${err}`);
      return null;
    }
  }

  // YouTube fallback
  async function fetchFromYouTube(id) {
    log("Fallback → YouTube API");

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${id}&key=${window.YT_API_KEY}`
      );
      const data = await res.json();
      return data.items?.[0] || null;
    } catch (err) {
      log(`YouTube failed: ${err}`);
      return null;
    }
  }

  // Normalize into a shape GlobalPlayer already understands
  const normalizeVideo = (v) => {
    if (!v) return null;

    // Invidious shape
    if (v.videoId || v.formatStreams || v.adaptiveFormats) {
      return {
        id: v.videoId || id,
        title: v.title,
        author: v.author,
        description: v.description,
        // Let GlobalPlayer handle picking the right stream; we just pass raw
        invidious: v,
      };
    }

    // YouTube API shape
    if (v.id && v.snippet) {
      return {
        id: typeof v.id === "string" ? v.id : v.id.videoId,
        title: v.snippet.title,
        author: v.snippet.channelTitle,
        description: v.snippet.description,
        youtube: v,
      };
    }

    return null;
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      setSourceUsed(null);

      let raw = await fetchFromInvidious(id);
      if (raw && raw.title) {
        setSourceUsed("INVIDIOUS");
      } else {
        raw = await fetchFromYouTube(id);
        if (raw) setSourceUsed("YOUTUBE_API");
      }

      const normalized = normalizeVideo(raw);
      setVideo(normalized);

      if (normalized) {
        log(`Calling playVideo for id=${normalized.id}`);
        playVideo(normalized);
      } else {
        log("No video data available after all fallbacks");
      }

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

  return (
    <>
      <DebugOverlay pageName="Watch" sourceUsed={sourceUsed} />

      <div style={{ padding: 16, color: "#fff" }}>
        <h2>{video.title}</h2>
        <p style={{ opacity: 0.7 }}>{video.author}</p>
      </div>
    </>
  );
}
