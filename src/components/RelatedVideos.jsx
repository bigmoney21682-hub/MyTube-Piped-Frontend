// File: src/components/RelatedVideos.jsx
// PCC v13.0 — Vertical related video list
// - Accepts items from PlayerContext
// - Renders RelatedVideoCard for each
// - Clean mobile-first layout

import React from "react";
import RelatedVideoCard from "./RelatedVideoCard";

export default function RelatedVideos({ items }) {
  if (!items || !items.length) {
    return (
      <p style={{ color: "#aaa", opacity: 0.7 }}>
        No related videos available.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {items.map((v) => (
        <RelatedVideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}
