/**
 * File: getApiKey.js
 * Path: src/api/getApiKey.js
 * Description: Provides a safe YouTube API key with primary + fallback support.
 */

export function getApiKey() {
  return (
    import.meta.env.VITE_YT_API_PRIMARY ??
    import.meta.env.VITE_YT_API_FALLBACK1 ??
    ""
  );
}
