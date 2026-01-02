// File: src/utils/normalizeId.js
// Ensures all navigation receives a clean string video ID.

export function normalizeId(raw) {
  if (!raw) return null;

  // If raw itself IS the ID
  if (typeof raw === "string") return raw.trim() || null;

  // Common YouTube API shapes:

  // Trending, related, mostPopular:
  // { id: "abc123" }
  if (typeof raw.id === "string") return raw.id.trim() || null;

  // Search results:
  // { id: { videoId: "abc123" } }
  if (typeof raw.id === "object" && typeof raw.id.videoId === "string") {
    return raw.id.videoId.trim() || null;
  }

  // PlaylistItems:
  // { snippet: { resourceId: { videoId: "abc123" } } }
  if (typeof raw.snippet?.resourceId?.videoId === "string") {
    return raw.snippet.resourceId.videoId.trim() || null;
  }

  // Direct field:
  // { videoId: "abc123" }
  if (typeof raw.videoId === "string") return raw.videoId.trim() || null;

  // Reject anything else
  return null;
}
