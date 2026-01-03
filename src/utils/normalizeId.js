/**
 * File: normalizeId.js
 * Path: src/utils/normalizeId.js
 * Description:
 *   Safely extracts a YouTube video ID from any known API shape.
 *   Now instrumented with bootDebug logs to trace invalid IDs.
 */

export default function normalizeId(input) {
  // ------------------------------------------------------------
  // 1. Log raw input for debugging
  // ------------------------------------------------------------
  try {
    window.bootDebug?.router(
      "normalizeId.js → input = " + JSON.stringify(input)
    );
  } catch (_) {
    // ignore JSON stringify errors
  }

  let id = null;

  // ------------------------------------------------------------
  // 2. Handle simple string IDs
  // ------------------------------------------------------------
  if (typeof input === "string") {
    id = input.trim();
  }

  // ------------------------------------------------------------
  // 3. Handle objects with common YouTube API shapes
  // ------------------------------------------------------------
  else if (input && typeof input === "object") {
    // Piped API: { id: "abc123" }
    if (input.id && typeof input.id === "string") {
      id = input.id.trim();
    }

    // YouTube search API: { videoId: "abc123" }
    else if (input.videoId && typeof input.videoId === "string") {
      id = input.videoId.trim();
    }

    // YouTube playlist items: { id: { videoId: "abc123" } }
    else if (
      input.id &&
      typeof input.id === "object" &&
      typeof input.id.videoId === "string"
    ) {
      id = input.id.videoId.trim();
    }

    // YouTube search results: { id: { kind: "...", videoId: "abc123" } }
    else if (
      input.id &&
      typeof input.id === "object" &&
      typeof input.id.videoId === "string"
    ) {
      id = input.id.videoId.trim();
    }

    // Piped trending: { url: "/watch?v=abc123" }
    else if (typeof input.url === "string") {
      const match = input.url.match(/v=([^&]+)/);
      if (match) id = match[1];
    }
  }

  // ------------------------------------------------------------
  // 4. Final cleanup
  // ------------------------------------------------------------
  if (typeof id === "string") {
    id = id.replace(/[^a-zA-Z0-9_-]/g, "");
  }

  // ------------------------------------------------------------
  // 5. Log output
  // ------------------------------------------------------------
  try {
    window.bootDebug?.router(
      "normalizeId.js → output = " + JSON.stringify(id)
    );
  } catch (_) {}

  // ------------------------------------------------------------
  // 6. Return null instead of throwing
  //    (throwing here would cause GLOBAL boot errors)
  // ------------------------------------------------------------
  return id || null;
}
