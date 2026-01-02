/**
 * File: quotaTracker.js
 * Path: src/debug/quotaTracker.js
 * Description: Tracks ALL YouTube API calls (success + failure) per API key.
 */

import { debugBus } from "./debugBus.js";

// Total units per key
const quota = {};

// Total calls per key
const calls = {};

/**
 * Records a quota event for a key.
 *
 * @param {string} key  - API key used
 * @param {object|number} infoOrCost - either cost (number) or info object
 *   info: { cost, status, ok, url, endpoint, reason }
 */
export function recordQuotaUsage(key, infoOrCost) {
  if (!key) return;

  let info = {};
  let cost = 1;

  if (typeof infoOrCost === "number") {
    cost = infoOrCost;
  } else if (typeof infoOrCost === "object" && infoOrCost !== null) {
    info = infoOrCost;
    if (typeof info.cost === "number") cost = info.cost;
  }

  quota[key] = (quota[key] || 0) + cost;
  calls[key] = (calls[key] || 0) + 1;

  debugBus.log(
    "NETWORK",
    `Quota → ${key} used ${cost} units (total=${quota[key]}, calls=${calls[key]})`,
    info
  );
}

/**
 * Backwards‑compatible snapshot: returns just total units per key.
 * This keeps your existing debug UI working.
 */
export function getQuotaSnapshot() {
  return { ...quota };
}

/**
 * Optional: richer details if you want them later.
 */
export function getQuotaDetails() {
  return {
    quota: { ...quota },
    calls: { ...calls }
  };
}
