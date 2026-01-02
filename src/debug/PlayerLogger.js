/**
 * File: PlayerLogger.js
 * Path: src/debug/PlayerLogger.js
 * Description: Logs HTML5 <video> and YouTube IFrame API events into debugBus.
 */

import { debugBus } from "./debugBus.js";

export function installPlayerLogger() {
  if (window.__playerLoggerInstalled) return;
  window.__playerLoggerInstalled = true;

  // ------------------------------------------------------------
  // HTML5 <video> logger
  // ------------------------------------------------------------
  const hookHTML5 = (video) => {
    if (!video || video.__playerLoggerAttached) return;
    video.__playerLoggerAttached = true;

    const events = [
      "play",
      "pause",
      "seeking",
      "seeked",
      "waiting",
      "playing",
      "ended",
      "error",
      "loadeddata",
      "timeupdate"
    ];

    events.forEach((ev) => {
      video.addEventListener(ev, () => {
        debugBus.log("PLAYER", `HTML5 → ${ev}`, {
          type: "html5",
          event: ev,
          currentTime: video.currentTime
        });
      });
    });
  };

  // Observe DOM for <video> elements
  const observer = new MutationObserver(() => {
    document.querySelectorAll("video").forEach(hookHTML5);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ------------------------------------------------------------
  // YouTube IFrame API logger
  // ------------------------------------------------------------
  window.onYouTubeIframeAPIReady = function () {
    debugBus.log("PLAYER", "YouTube API ready");
  };

  debugBus.log("PLAYER", "PlayerLogger installed");
}
