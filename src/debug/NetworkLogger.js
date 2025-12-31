/**
 * File: NetworkLogger.js
 * Path: src/debug/NetworkLogger.js
 * Description: Global fetch() interceptor that logs all network activity
 *              into debugBus with structured metadata.
 */

import { debugBus } from "./debugBus.js";

export function installNetworkLogger() {
  if (window.__networkLoggerInstalled) return;
  window.__networkLoggerInstalled = true;

  const originalFetch = window.fetch;

  window.fetch = async function (url, options = {}) {
    const method = options.method || "GET";
    const start = performance.now();

    // Emit request start
    debugBus.log("NETWORK", `FETCH → ${method} ${url}`, {
      url,
      method
    });

    try {
      const response = await originalFetch(url, options);
      const duration = (performance.now() - start).toFixed(1);

      // Emit response
      debugBus.log(
        "NETWORK",
        `RESPONSE → ${method} ${url} | status=${response.status} | ${duration}ms`,
        {
          url,
          method,
          status: response.status,
          duration
        }
      );

      return response;
    } catch (err) {
      const duration = (performance.now() - start).toFixed(1);

      // Emit error
      debugBus.log(
        "NETWORK",
        `ERROR → ${method} ${url} | ${err.message} | ${duration}ms`,
        {
          url,
          method,
          error: err.message,
          duration
        }
      );

      throw err;
    }
  };
}
