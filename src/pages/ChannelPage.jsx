// File: src/pages/ChannelPage.jsx
// PCC v2.0 — Channel details + latest uploads with subscriptions + full safety

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import DebugOverlay from "../components/DebugOverlay";
import VideoCard from "../components/VideoCard";
import { getCached, setCached } from "../utils/youtubeCache";
import { useSubscriptions } from "../hooks/useSubscriptions";

export default function ChannelPage() {
  const { id } = useParams(); // channelId
  const navigate = useNavigate();
  const location = useLocation();
  const { subscribe, unsubscribe, isSubscribed } = useSubscriptions();

  const [channel, setChannel] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loadingChannel, setLoadingChannel] = useState(true);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [sourceUsed, setSourceUsed] = useState(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const log = (msg) => window.debugLog?.(`ChannelPage: ${msg}`);

  // Data passed from Watch.jsx (optional)
  const passedTitle = location.state?.channelTitle || null;
  const passedThumb = location.state?.channelThumb || null;

  const apiKey = window.YT_API_KEY;

  // ------------------------------------------------------------
  // Load channel details (snippet + contentDetails)
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadChannel() {
      const channelId = String(id || "").trim();
      if (!channelId) {
        log("No channel id — aborting");
        setLoadingChannel(false);
        return;
      }

      const cacheKey = `channel_${channelId}`;
      const cached = getCached(cacheKey);
      if (cached) {
        log(`Using cached channel data for ${channelId}`);
        setChannel(cached);
        setSourceUsed("CACHE");
        setLoadingChannel(false);
        return;
      }

      if (!apiKey) {
        log("ERROR: No YT_API_KEY — cannot fetch channel");
        setLoadingChannel(false);
        return;
      }

      try {
        const url =
          "https://www.googleapis.com/youtube/v3/channels" +
          `?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`;

        log(`Fetching channel → ${url}`);

        const res = await fetch(url);
        const data = await res.json();

        if (data?.error?.errors?.[0]?.reason === "quotaExceeded") {
          log("ERROR: Quota exceeded while fetching channel");
          setQuotaExceeded(true);
          setLoadingChannel(false);
          return;
        }

        if (!data.items || !data.items.length) {
          log("ERROR: Channel returned no items");
          setLoadingChannel(false);
          return;
        }

        const item = data.items[0];
        const snippet = item.snippet || {};
        const thumbObj = snippet.thumbnails || {};
        const thumbnail =
          thumbObj.high?.url ||
          thumbObj.medium?.url ||
          thumbObj.default?.url ||
          passedThumb ||
          null;

        const normalized = {
          id: channelId,
          title: snippet.title || passedTitle || "Unknown Channel",
          description: snippet.description || "",
          thumbnail,
          uploadsPlaylistId:
            item.contentDetails?.relatedPlaylists?.uploads || null,
          subscriberCount: item.statistics?.subscriberCount || null,
          videoCount: item.statistics?.videoCount || null,
        };

        setCached(cacheKey, normalized);
        setChannel(normalized);
        setSourceUsed("YOUTUBE_API");
      } catch (err) {
        log("ERROR: Channel fetch failed: " + err);
      }

      setLoadingChannel(false);
    }

    loadChannel();
  }, [id, apiKey]);

  // ------------------------------------------------------------
  // Load latest uploads from channel's uploads playlist
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadUploads() {
      if (!channel || !channel.uploadsPlaylistId) {
        setLoadingUploads(false);
        return;
      }

      const playlistId = channel.uploadsPlaylistId;
      const cacheKey = `uploads_${playlistId}`;

      const cached = getCached(cacheKey);
      if (cached) {
        log(`Using cached uploads for playlist ${playlistId}`);
        setUploads(cached);
        setLoadingUploads(false);
        return;
      }

      if (!apiKey) {
        log("ERROR: No YT_API_KEY — cannot fetch uploads");
        setLoadingUploads(false);
        return;
      }

      try {
        const url =
          "https://www.googleapis.com/youtube/v3/playlistItems" +
          `?part=snippet,contentDetails&maxResults=20&playlistId=${playlistId}&key=${apiKey}`;

        log(`Fetching uploads → ${url}`);

        const res = await fetch(url);
        const data = await res.json();

        if (data?.error?.errors?.[0]?.reason === "quotaExceeded") {
          log("ERROR: Quota exceeded while fetching uploads");
          setQuotaExceeded(true);
          setLoadingUploads(false);
          return;
        }

        if (!data.items || !Array.isArray(data.items)) {
          log("ERROR: Uploads returned no items or invalid format");
          setLoadingUploads(false);
          return;
        }

        const normalized = data.items.map((item) => {
          const snippet = item.snippet || {};
          const t = snippet.thumbnails || {};
          const thumbnail =
            t.maxres?.url ||
            t.high?.url ||
            t.medium?.url ||
            t.default?.url ||
            null;

          return {
            id: snippet.resourceId?.videoId || item.contentDetails?.videoId,
            title: snippet.title || "Untitled Video",
            author: snippet.channelTitle || channel.title,
            thumbnail,
            duration: null, // not included in playlistItems; would need an extra videos call
          };
        });

        setCached(cacheKey, normalized);
        setUploads(normalized);
      } catch (err) {
        log("ERROR: Uploads fetch failed: " + err);
      }

      setLoadingUploads(false);
    }

    loadUploads();
  }, [channel, apiKey]);

  const subscribed = channel ? isSubscribed(channel.id) : false;

  const handleToggleSub = () => {
    if (!channel) return;
    if (subscribed) {
      unsubscribe(channel.id);
      log(`Unsubscribed from ${channel.id}`);
    } else {
      subscribe({
        channelId: channel.id,
        title: channel.title,
        thumbnail: channel.thumbnail,
      });
      log(`Subscribed to ${channel.id}`);
    }
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  const pageTitle = channel?.title || passedTitle || "Channel";
  const thumb = channel?.thumbnail || passedThumb || null;

  return (
    <>
      <DebugOverlay pageName="Channel" sourceUsed={sourceUsed} />

      <div style={{ padding: 16, color: "#fff" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "6px 12px",
            background: "#222",
            border: "1px solid #444",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          ← Back
        </button>

        {/* Channel header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {thumb && (
            <img
              src={thumb}
              alt={pageTitle}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {pageTitle}
            </h1>

            {channel && (
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                {channel.subscriberCount && (
                  <span style={{ marginRight: 12 }}>
                    {Number(channel.subscriberCount).toLocaleString()} subscribers
                  </span>
                )}
                {channel.videoCount && (
                  <span>
                    {Number(channel.videoCount).toLocaleString()} videos
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleToggleSub}
            disabled={!channel}
            style={{
              padding: "6px 12px",
              background: subscribed ? "#444" : "#ff0000",
              borderRadius: 999,
              border: "none",
              color: "#fff",
              cursor: channel ? "pointer" : "default",
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Channel description */}
        {channel && channel.description && (
          <p
            style={{
              fontSize: 13,
              opacity: 0.85,
              whiteSpace: "pre-wrap",
              marginBottom: 20,
              maxHeight: 120,
              overflow: "hidden",
            }}
          >
            {channel.description}
          </p>
        )}

        {/* Quota banner if any API hit quota */}
        {quotaExceeded && (
          <div
            style={{
              padding: "12px 14px",
              background: "#331111",
              border: "1px solid #552222",
              borderRadius: 8,
              color: "#ff7777",
              marginBottom: 16,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            YouTube Data API v3 quota reached — Channel data may be incomplete.
          </div>
        )}

        {/* Loading states */}
        {loadingChannel && (
          <p style={{ opacity: 0.7, marginBottom: 16 }}>Loading channel…</p>
        )}

        {!loadingChannel && !channel && !quotaExceeded && (
          <p style={{ opacity: 0.7, marginBottom: 16 }}>
            Unable to load this channel.
          </p>
        )}

        {/* Uploads grid */}
        <h2 style={{ margin: "8px 0 12px" }}>Latest uploads</h2>

        {loadingUploads && (
          <p style={{ opacity: 0.7 }}>Loading uploads…</p>
        )}

        {!loadingUploads && uploads.length === 0 && (
          <p style={{ opacity: 0.7 }}>No uploads available.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
          }}
        >
          {uploads.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </>
  );
}
