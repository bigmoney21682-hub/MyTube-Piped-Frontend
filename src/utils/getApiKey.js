// File: src/utils/getApiKey.js
// PCC v2.0 — Automatic fallback API key rotation + debug logging
// Uses API_KEYS from src/config/keys.js and retries on quotaExceeded

import { API_KEYS } from "../config/keys";

export async function fetchWithFallback(urlBuilder) {
  const keys = API_KEYS;

  for (const label of ["primary", "fallback1"]) {
    const key = keys[label];
    if (!key) continue;

    const url = urlBuilder(key);

    // Debug logging (your DebugOverlay listens to window.debugLog)
    window.debugLog?.(`API KEY USED → ${label}`);
    window.debugLog?.(`URL → ${url}`);

    try {
      const res = await fetch(url);
      const data = await res.json();

      // Quota exceeded → try next key
      if (data?.error?.errors?.[0]?.reason === "quotaExceeded") {
        window.debugLog?.(`QUOTA EXCEEDED on ${label}, trying next…`);
        continue;
      }

      // Success
      return { data, keyUsed: label };
    } catch (err) {
      window.debugLog?.(`ERROR on ${label}: ${err}`);
      continue;
    }
  }

  // All keys failed
  return { data: null, keyUsed: null };
}
