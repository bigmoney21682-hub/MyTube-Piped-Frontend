// File: navigateTo.js
// Path: src/utils/navigateTo.js
// Description: Safe navigation helper for HashRouter + Safari Private Mode.
// NOTE: Watch route removed — goWatch() deleted.

export function navigateTo(navigate, pathname, params = {}) {
  // Build query string
  const search = Object.keys(params).length
    ? "?" +
      Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&")
    : "";

  navigate({
    pathname,
    search
  });
}

// Convenience wrappers
export function goSearch(navigate, query) {
  navigateTo(navigate, `/search`, { q: query });
}

export function goPlaylist(navigate, id) {
  navigateTo(navigate, `/playlist/${id}`);
}
