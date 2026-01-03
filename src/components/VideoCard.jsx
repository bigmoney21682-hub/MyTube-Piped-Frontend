/**
 * File: VideoCard.jsx
 * Path: src/components/VideoCard.jsx
 * Description:
 *   Renders a clickable video card with thumbnail, title,
 *   channel name, and normalized video ID.
 */

import React from "react";
import { Link } from "react-router-dom";

import normalizeId from "../utils/normalizeId.js";

export default function VideoCard({ item, index = 0 }) {
  if (!item) {
    window.bootDebug?.router("VideoCard.jsx → item is null/undefined");
    return null;
  }

  // Log raw upstream item
  try {
    window.bootDebug?.router(
      "VideoCard.jsx → raw item = " + JSON.stringify(item)
    );
  } catch (_) {}

  const id = normalizeId(item);

  // Log normalized ID
  window.bootDebug?.router(
    "VideoCard.jsx → normalizeId(item) = " + JSON.stringify(id)
  );

  if (!id) {
    window.bootDebug?.router(
      "VideoCard.jsx → INVALID ID, skipping card. Upstream item = " +
        JSON.stringify(item)
    );
    return null;
  }

  const snippet = item.snippet || {};
  const thumb = snippet?.thumbnails?.medium?.url || "";
  const title = snippet?.title || "Untitled";
  const channel = snippet?.channelTitle || "Unknown Channel";

  // Log navigation intent
  window.bootDebug?.router(
    `VideoCard.jsx → will navigate to /watch/${id}?src=card`
  );

  return (
    <Link
      to={`/watch/${id}?src=card`}
      onClick={() => {
        window.bootDebug?.router(
          `VideoCard.jsx → CLICK → navigating to /watch/${id}?src=card`
        );
      }}
      style={{
        display: "block",
        marginBottom: "20px",
        color: "#fff",
        textDecoration: "none"
      }}
    >
      <img
        src={thumb}
        alt={title}
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "8px"
        }}
      />

      <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>
        {title}
      </div>

      <div style={{ fontSize: "13px", opacity: 0.7 }}>
        {channel}
      </div>
    </Link>
  );
}
