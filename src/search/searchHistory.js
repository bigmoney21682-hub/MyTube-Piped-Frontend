/**
 * File: searchHistory.js
 * Path: src/search/searchHistory.js
 * Description: Persistent search history (max 10 items).
 */

const KEY = "searchHistory";

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(query) {
  try {
    const raw = localStorage.getItem(KEY);
    let arr = raw ? JSON.parse(raw) : [];

    // Dedupe + move to front
    arr = [query, ...arr.filter((x) => x !== query)];

    // Limit to 10
    if (arr.length > 10) arr = arr.slice(0, 10);

    localStorage.setItem(KEY, JSON.stringify(arr));
    return arr;
  } catch {
    return [];
  }
}
