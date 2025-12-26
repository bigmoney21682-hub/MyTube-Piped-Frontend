/**
 * File: debug-boot.js
 * Path: public/debug-boot.js
 * Description: Boot-level debug console that logs before React mounts. Full-width, color-coded.
 */

(function () {
  const box = document.createElement("div");
  box.id = "boot-debug";
  box.style.position = "fixed";
  box.style.bottom = "0";
  box.style.left = "0";
  box.style.width = "100vw";          // FULL WIDTH
  box.style.maxHeight = "45vh";
  box.style.overflowY = "auto";
  box.style.background = "rgba(0,0,0,0.85)";
  box.style.color = "#0f0";
  box.style.fontFamily = "monospace";
  box.style.fontSize = "12px";
  box.style.padding = "8px";
  box.style.zIndex = "999999";
  box.style.borderTop = "2px solid #333";

  document.body.appendChild(box);

  function log(level, msg) {
    const line = document.createElement("div");

    // Color coding
    const colors = {
      INFO: "#0f0",
      WARN: "#ff0",
      ERROR: "#f33",
      BOOT: "#0af"
    };

    line.style.color = colors[level] || "#0f0";
    line.textContent = `[${level}] ${msg}`;
    box.appendChild(line);
  }

  // Expose global logging
  window.bootDebug = {
    info: (msg) => log("INFO", msg),
    warn: (msg) => log("WARN", msg),
    error: (msg) => log("ERROR", msg),
    boot: (msg) => log("BOOT", msg)
  };

  window.bootDebug.boot("Boot debug console initialized");
})();
