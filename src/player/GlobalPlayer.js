/**
 * File: GlobalPlayer.js
 * Path: src/player/GlobalPlayer.js
 * Description: Centralized YouTube IFrame Player wrapper with event dispatch.
 */

import { debugBus } from "../debug/debugBus.js";

let stateListeners = [];

/* ------------------------------------------------------------
   Persist API readiness across module reloads (StrictMode/HMR)
------------------------------------------------------------- */
window.__YT_API_READY__ = window.__YT_API_READY__ || false;
let apiReady = window.__YT_API_READY__;

/* ------------------------------------------------------------
   Load YouTube IFrame API ONCE
------------------------------------------------------------- */
(function loadYouTubeAPI() {
  debugBus.log("YouTube", "Loader executed");

  // If YT already exists, mark ready immediately
  if (window.YT && window.YT.Player) {
    window.__YT_API_READY__ = true;
    apiReady = true;
    debugBus.log("YouTube", "YT already available");
    return;
  }

  // Prevent duplicate script injection
  if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
    debugBus.log("YouTube", "Injecting iframe_api script");

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    debugBus.log("YouTube", "iframe_api appended");
  }

  // Global callback fired by YouTube API
  window.onYouTubeIframeAPIReady = () => {
    window.__YT_API_READY__ = true;
    apiReady = true;
    debugBus.log("YouTube API ready");
  };
})();

/* ------------------------------------------------------------
   GlobalPlayer API
------------------------------------------------------------- */
export const GlobalPlayer = {
  player: null,
  mounted: false,

  /* ------------------------------------------------------------
     Subscribe to player state changes
  ------------------------------------------------------------- */
  onStateChange(cb) {
    stateListeners.push(cb);
  },

  _emitState(state) {
    debugBus.log("GlobalPlayer → State:", state);
    stateListeners.forEach((cb) => cb(state));
  },

  /* ------------------------------------------------------------
     Ensure #player exists before loading
  ------------------------------------------------------------- */
  ensureMounted() {
    if (this.mounted) return;

    const el = document.getElementById("player");
    if (!el) {
      debugBus.log("GlobalPlayer", "ensureMounted → #player not found");
      return;
    }

    this.mounted = true;
    debugBus.log("GlobalPlayer", "Mounted");
  },

  /* ------------------------------------------------------------
     Load a video into the YouTube IFrame Player
  ------------------------------------------------------------- */
  load(id) {
    if (!this.mounted) {
      debugBus.log("GlobalPlayer", "load() called before mounted");
      return;
    }

    if (!apiReady) {
      debugBus.log("GlobalPlayer", "YT API not ready, retrying…");
      setTimeout(() => this.load(id), 100);
      return;
    }

    debugBus.log("GlobalPlayer", `Loading video ${id}`);

    // Destroy previous instance if needed
    if (this.player?.destroy) {
      this.player.destroy();
    }

    // Create new YouTube IFrame Player
    this.player = new window.YT.Player("player", {
      videoId: id,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0
      },
      events: {
        onReady: () => {
          debugBus.log("GlobalPlayer", "Player ready");
        },
        onStateChange: (event) => {
          this._emitState(event.data);
        }
      }
    });
  }
};
