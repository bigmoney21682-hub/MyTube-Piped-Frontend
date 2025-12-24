// File: src/utils/getApiKey.js
// PCC v3.0 — API key rotation + debug logging.

export const API_KEYS = {
  primary: import.meta.env.VITE_YT_API_PRIMARY,
  fallback1: import.meta.env.VITE_YT_API_FALLBACK1,
};

// Debug print to browser console
console.log("DEBUG: VITE_YT_API_PRIMARY =", API_KEYS.primary);
console.log("DEBUG: VITE_YT_API_FALLBACK1 =", API_KEYS.fallback1);

export async function fetchWithFallback(buildUrl) {
  const keys = [API_KEYS.primary, API_KEYS.fallback1];

  for (const key of keys) {
    if (!key) {
      window.debugLog?.(`API KEY MISSING → ${key}`);
      continue;
    }

    const url = buildUrl(key);
    window.debugLog?.(`URL → ${url}`);
    window.debugLog?.(`API KEY USED → ${key}`);

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.error) {
        return { data, keyUsed: key };
      }

      window.debugLog?.(`ERROR for key ${key}: ${data.error?.message}`);
    } catch (err) {
      window.debugLog?.(`FETCH ERROR for key ${key}: ${err}`);
    }
  }

  return { data: null, keyUsed: null };
}
