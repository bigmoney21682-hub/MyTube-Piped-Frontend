/**
 * File: NetworkLogger.js
 * Path: src/debug/NetworkLogger.js
 * Description: Global fetch() interceptor that logs all network activity
 *              into debugBus with level="NETWORK".
 */

import { debugBus } from "./debugBus.js";

export function installNetworkLogger() {
  if (window.__networkLoggerInstalled) return;
  window.__networkLoggerInstalled = true;

  const originalFetch = window.fetch;

  window.fetch = async function (url, options = {}) {
    const method = options.method || "GET";
    const start = performance.now();

    debugBus.log({
      level: "NETWORK",
      msg: `FETCH → ${method} ${url}`,
      ts: Date.now()
    });

    try {
      const response = await originalFetch(url, options);
      const duration = (performance.now() - start).toFixed(1);

      debugBus.log({
        level: "NETWORK",
        msg: `RESPONSE → ${method} ${url} | status=${response.status} | ${duration}ms`,
        ts: Date.now()
      });

      return response;
    } catch (err) {
      const duration = (performance.now() - start).toFixed(1);

      debugBus.log({
        level: "NETWORK",
        msg: `ERROR → ${method} ${url} | ${err.message} | ${duration}ms`,
        ts: Date.now()
      });

      throw err;
    }
  };
}
