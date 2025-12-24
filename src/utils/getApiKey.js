// File: src/utils/getApiKey.js
// PCC v4.0 — Full API key rotation + complete debug logging.
// This version logs:
// - Which key is being passed
// - Which key is being used
// - URL being called
// - Errors per key
// - Missing keys

export const API_KEYS = {
  primary: import.meta.env.VITE_YT_API_PRIMARY,
  fallback1: import.meta.env.VITE_YT_API_FALLBACK1,
};

// Debug print to browser console (not overlay)
console.log("DEBUG: VITE_YT_API_PRIMARY =", API_KEYS.primary);
console.log("DEBUG: VITE_YT_API_FALLBACK1 =", API_KEYS.fallback1);

export async function fetchWithFallback(buildUrl) {
  const keys = [API_KEYS.primary, API_KEYS.fallback1];

  for (const key of keys) {
    // Missing key
    if (!key) {
      window.debugLog?.(`API KEY MISSING → ${key}`);
      continue;
    }

    // ⭐ NEW: Log which API key is being passed
    const label = key === API_KEYS.primary ? "PRIMARY" : "FALLBACK1";
    window.debugLog?.(`API KEY PASSED → ${label} (${key})`);

    // Build URL with this key
    const url = buildUrl(key);

    // Log URL + key
    window.debugLog?.(`URL → ${url}`);
    window.debugLog?.(`API KEY USED → ${key}`);

    try {
      const res = await fetch(url);
      const data = await res.json();

      // Success
      if (!data.error) {
        return { data, keyUsed: key };
      }

      // API error
      window.debugLog?.(
        `ERROR for key ${label}: ${data.error?.message || "Unknown error"}`
      );
    } catch (err) {
      // Network error
      window.debugLog?.(`FETCH ERROR for key ${label}: ${err}`);
    }
  }

  // All keys failed
  return { data: null, keyUsed: null };
}
