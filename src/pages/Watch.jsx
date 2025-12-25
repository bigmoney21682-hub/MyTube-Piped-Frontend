// File: src/pages/Watch.jsx
// PCC v13.0 — Full Telemetry Watch Page
// rebuild-watch-13

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DebugOverlay from "../components/DebugOverlay";
import { usePlayer } from "../contexts/PlayerContext";
import { getApiKey } from "../utils/getApiKey";
import { fetchWithCache } from "../utils/youtubeCache";

export default function Watch() {
  const { id } = useParams();
  const {
    playVideo,
    setRelatedVideos,
    relatedVideos,
    currentVideo,
  } = usePlayer();

  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);

  // ------------------------------------------------------------
  // Logging helper
  // ------------------------------------------------------------
  const log = (msg, category = "API") => {
    if (window.debugEvent) window.debugEvent(msg, category);
    else window.debugLog?.(msg, category);
  };

  // ------------------------------------------------------------
  // Fetch metadata + related videos
  // ------------------------------------------------------------
  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      log(`Watch.jsx → loading video ${id}`, "ROUTER");

      // -----------------------------
      // 1. Fetch metadata
      // -----------------------------
      try {
        const key = getApiKey();
        const metaURL =
          `https://www.googleapis.com/youtube/v3/videos?` +
          `part=snippet,contentDetails,statistics&id=${id}&key=${key}`;

        log(`META URL → ${metaURL}`, "API");

        const metaRes = await fetchWithCache(metaURL);

        if (!metaRes.ok) {
          const body = await safeBody(metaRes);
          log(`META ERROR → status=${metaRes.status}`, "ERROR");
          log(`META BODY → ${body}`, "ERROR");
        }

        const metaJson = await metaRes.json();
        if (!cancelled) {
          setMeta(metaJson.items?.[0] || null);
          log(`META OK → title="${metaJson.items?.[0]?.snippet?.title}"`, "API");
        }
      } catch (err) {
        log(`META FETCH EXCEPTION → ${err.message}`, "ERROR");
      }

      // -----------------------------
      // 2. Fetch related videos
      // -----------------------------
      try {
        const key = getApiKey();
        const relURL =
          `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&type=video&relatedToVideoId=${id}&maxResults=25&key=${key}`;

        log(`RELATED URL → ${relURL}`, "API");

        const relRes = await fetchWithCache(relURL);

        if (!relRes.ok) {
          const body = await safeBody(relRes);
          log(`RELATED ERROR → status=${relRes.status}`, "ERROR");
          log(`RELATED BODY → ${body}`, "ERROR");
        }

        const relJson = await relRes.json();
        if (!cancelled) {
          const mapped = (relJson.items || []).map((i) => ({
            id: i.id.videoId,
            title: i.snippet.title,
            thumb: i.snippet.thumbnails?.medium?.url,
          }));
          setRelatedVideos(mapped);
          log(`RELATED OK → ${mapped.length} items`, "API");
        }
      } catch (err) {
        log(`RELATED FETCH EXCEPTION → ${err.message}`, "ERROR");
      }

      // -----------------------------
      // 3. Autoplay current video
      // -----------------------------
      if (!cancelled && meta) {
        playVideo({ id, title: meta?.snippet?.title });
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
      log(`Watch.jsx unmounted`, "UI");
    };
  }, [id]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div style={{ padding: 16 }}>
      <DebugOverlay pageName="Watch" sourceUsed="YouTube API" />

      {loading && <div style={{ color: "#fff" }}>Loading…</div>}

      {!loading && meta && (
        <>
          <h2 style={{ color: "#fff" }}>{meta.snippet?.title}</h2>
          <p style={{ color: "#aaa" }}>{meta.snippet?.channelTitle}</p>

          <h3 style={{ color: "#fff", marginTop: 24 }}>Related Videos</h3>
          {relatedVideos.length === 0 && (
            <div style={{ color: "#888" }}>No related videos found.</div>
          )}

          {relatedVideos.map((v) => (
            <div key={v.id} style={{ marginBottom: 12 }}>
              <img src={v.thumb} width={160} />
              <div style={{ color: "#fff" }}>{v.title}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Safe body reader
// ------------------------------------------------------------
async function safeBody(res) {
  try {
    return await res.text();
  } catch {
    return "<unreadable>";
  }
}
