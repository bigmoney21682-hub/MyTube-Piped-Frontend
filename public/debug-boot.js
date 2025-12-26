/**
 * File: debug-boot.js
 * Path: public/debug-boot.js
 * Description: Boot-level debug console that logs before React mounts.
 */

(function () {
  const box = document.createElement("div");
  box.id = "boot-debug";
  box.style.position = "fixed";
  box.style.bottom = "0";
  box.style.left = "0";
  box.style.right = "0";
  box.style.maxHeight = "40vh";
  box.style.overflowY = "auto";
  box.style.background = "rgba(0,0,0,0.85)";
  box.style.color = "#0f0";
  box.style.fontFamily = "monospace";
  box.style.fontSize = "12px";
  box.style.padding = "8px";
  box.style.zIndex = "999999";

  document.body.appendChild(box);

  function log(msg) {
    const line = document.createElement("div");
    line.textContent = `[BOOT] ${msg}`;
    box.appendChild(line);
  }

  window.bootDebug = log;

  log("Boot debug console initialized");
})();
