/**
 * File: debug-boot.js
 * Path: public/debug-boot.js
 * Description: Boot-level logger that stores logs before React mounts.
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
    _buffer: buffer
  };

  window.bootDebug.boot("Boot logger initialized");
})();
