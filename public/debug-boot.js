/**
 * File: debug-boot.js
 * Path: public/debug-boot.js
 * Description: Boot-level logger that stores logs before React mounts + intercepts fetch/XHR.
 */

(function () {
  const buffer = [];

  function push(level, msg) {
    buffer.push({
      level,
      msg,
      ts: Date.now()
    });
  }

  window.bootDebug = {
    info: (msg) => push("INFO", msg),
    warn: (msg) => push("WARN", msg),
    error: (msg) => push("ERROR", msg),
    boot: (msg) => push("BOOT", msg),
    net: (msg) => push("NET", msg),
    _buffer: buffer
  };

  window.bootDebug.boot("Boot logger initialized");

  // --- Network Interception (Fetch) ---
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = args[0];
    window.bootDebug.net("FETCH → " + url);

    try {
      const res = await origFetch.apply(this, args);
      window.bootDebug.net("FETCH OK ← " + url + " (" + res.status + ")");
      return res;
    } catch (err) {
      window.bootDebug.error("FETCH FAIL ← " + url + " " + err.message);
      throw err;
    }
  };

  // --- Network Interception (XHR) ---
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    this._debugUrl = url;
    window.bootDebug.net("XHR → " + url);
    return origOpen.apply(this, arguments);
  };

  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    const url = this._debugUrl;
    this.addEventListener("load", () => {
      window.bootDebug.net("XHR OK ← " + url + " (" + this.status + ")");
    });
    this.addEventListener("error", () => {
      window.bootDebug.error("XHR FAIL ← " + url);
    });
    return origSend.apply(this, arguments);
  };
})();
