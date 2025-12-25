// File: src/initDebug.js
// PCC v5.0 — Global Fetch Instrumentation
// rebuild-debug-5

(function () {
  if (window.__PCC_FETCH_PATCHED__) return;
  window.__PCC_FETCH_PATCHED__ = true;

  const originalFetch = window.fetch;

  window.fetch = async function (url, options = {}) {
    const start = performance.now();
    const method = options.method || "GET";

    try {
      window.debugLog?.(
        `FETCH → ${method} ${url}`,
        "API"
      );

      const res = await originalFetch(url, options);
      const ms = (performance.now() - start).toFixed(1);

      window.debugLog?.(
        `FETCH OK → ${res.status} (${ms}ms) ${url}`,
        "API"
      );

      // Detect HTML fallback (GitHub Pages misrouting)
      const ct = res.headers.get("Content-Type") || "";
      if (ct.includes("text/html")) {
        window.debugLog?.(
          `FETCH WARNING → HTML response detected (likely fallback)`,
          "ERROR"
        );
      }

      return res;
    } catch (err) {
      const ms = (performance.now() - start).toFixed(1);

      window.debugLog?.(
        `FETCH FAIL → ${method} ${url} (${ms}ms) → ${err.message}`,
        "ERROR"
      );

      throw err;
    }
  };
})();
