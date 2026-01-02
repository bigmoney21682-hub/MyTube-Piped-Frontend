/**
 * File: youtube.js
 * Path: src/api/youtube.js
 * Description: Unified YouTube Data API v3 client with primary→fallback
 *              key failover, quota tracking, and key usage tracking.
 */

import { recordQuotaUsage } from "../debug/quotaTracker.js";
import { recordKeyUsage } from "../debug/keyUsageTracker.js";
import { debugBus } from "../debug/debugBus.js";

const PRIMARY_KEY = import.meta.env.VITE_YT_API_PRIMARY;
const FALLBACK_KEY = import.meta.env.VITE_YT_API_FALLBACK1;

if (!PRIMARY_KEY) console.error("VITE_YT_API_PRIMARY is not set");
if (!FALLBACK_KEY) console.warn("VITE_YT_API_FALLBACK1 is not set");

// YouTube API quota costs
const COSTS = {
  videos: 1,
  search: 100,
  channels: 1
};

export async function youtubeApiRequest(endpoint, params) {
  const baseUrl = `https://www.googleapis.com/youtube/v3/${endpoint}`;

  async function tryWithKey(key, label) {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    url.searchParams.set("key", key);

    debugBus.log(
      "NETWORK",
      `YT API ${label} → ${url.pathname}?${url.searchParams.toString()}`
    );

    const res = await fetch(url.toString());
    const cost = COSTS[endpoint] ?? 1;

    // Read body once for logging on error
    let text = null;
    let parsed = null;
    let reason = null;

    if (!res.ok) {
      try {
        text = await res.text();
        try {
          parsed = JSON.parse(text);
          reason = parsed?.error?.errors?.[0]?.reason;
        } catch {
          // non‑JSON error body
        }
      } catch {
        // ignore body read failure
      }

      debugBus.log(
        "NETWORK",
        `YT API ${label} ERROR → status=${res.status}, reason=${reason || "unknown"}, body=${text ?? "<no body>"}`
      );

      // Count this failed call against quota
      recordQuotaUsage(key, {
        cost,
        status: res.status,
        ok: false,
        url: url.toString(),
        endpoint,
        reason: reason || "error"
      });

      return { ok: false, status: res.status, data: null };
    }

    // Success
    const data = await res.json();

    recordQuotaUsage(key, {
      cost,
      status: res.status,
      ok: true,
      url: url.toString(),
      endpoint,
      reason: "success"
    });
    recordKeyUsage(key, label);

    debugBus.log(
      "NETWORK",
      `YT API ${label} OK → endpoint=${endpoint}, items=${data.items?.length ?? 0}`
    );

    return { ok: true, status: res.status, data };
  }

  // Primary
  if (PRIMARY_KEY) {
    try {
      const primary = await tryWithKey(PRIMARY_KEY, "PRIMARY");
      if (primary.ok) return primary.data;
    } catch (err) {
      debugBus.log("NETWORK", `YT API PRIMARY EXCEPTION → ${err.message}`);
    }
  }

  // Fallback
  if (FALLBACK_KEY) {
    try {
      const fallback = await tryWithKey(FALLBACK_KEY, "FALLBACK1");
      if (fallback.ok) return fallback.data;
    } catch (err) {
      debugBus.log("NETWORK", `YT API FALLBACK1 EXCEPTION → ${err.message}`);
    }
  }

  debugBus.log("NETWORK", "YT API → All keys failed for endpoint " + endpoint);
  return null;
}
