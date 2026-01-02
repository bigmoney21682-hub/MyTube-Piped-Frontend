// File: src/utils/normalizeId.js
// Ensures all navigation receives a clean string video ID.

export function normalizeId(raw) {
  if (!raw) return null;

  // Already a string
  if (typeof raw === "string") return raw;

  // { id: "abc123" }
  if (typeof raw.id === "string") return raw.id;

  // { videoId: "abc123" }
  if (typeof raw.videoId === "string") return raw.videoId;

  // { id: { videoId: "abc123" } }
  if (raw.id?.videoId) return raw.id.videoId;

  // { snippet: { resourceId: { videoId: "abc123" } } }
  if (raw.snippet?.resourceId?.videoId) return raw.snippet.resourceId.videoId;

  return null;
}
