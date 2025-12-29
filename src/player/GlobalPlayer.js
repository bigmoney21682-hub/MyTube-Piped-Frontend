/**
 * File: GlobalPlayer.js
 * Path: src/player/GlobalPlayer.js
 * Description: Singleton wrapper around the YouTube IFrame Player API.
 */

import { debugBus } from "../debug/debugBus.js";

class GlobalPlayerClass {
  constructor() {
    this.player = null;
    this.ready = false;
    this.pendingLoad = null;
    this.onReady = null;
    this.onStateChange = null;

    this._initStarted = false;
  }

  init({ onReady, onStateChange }) {
    if (this._initStarted) {
      debugBus.player("GlobalPlayer → init() ignored (already started)");
      return;
    }

    this._initStarted = true;
    this.onReady = onReady;
    this.onStateChange = onStateChange;

    debugBus.player("GlobalPlayer → Waiting for YT API…");

    window.onYouTubeIframeAPIReady = () => {
      debugBus.player("GlobalPlayer → YT API ready");
      this._createPlayer();
    };

    if (window.YT && window.YT.Player) {
      debugBus.player("GlobalPlayer → YT API already loaded");
      this._createPlayer();
    }
  }

  _createPlayer() {
    if (this.player) {
      debugBus.player("GlobalPlayer → Player already exists");
      return;
    }

    const mount = document.getElementById("global-player");
    if (!mount) {
      debugBus.player("GlobalPlayer → ERROR: #global-player not found");
      return;
    }

    debugBus.player("GlobalPlayer → Creating player…");

    this.player = new window.YT.Player("global-player", {
      height: "100%",
      width: "100%",
      videoId: "",
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: () => {
          debugBus.player("GlobalPlayer → Player ready");
          this.ready = true;

          setTimeout(() => {
            try {
              this.player.setSize("100%", "100%");
              debugBus.player("GlobalPlayer → setSize(100%,100%) after init");
            } catch {}
          }, 50);

          if (typeof this.onReady === "function") {
            this.onReady();
          }

          if (this.pendingLoad) {
            debugBus.player("GlobalPlayer → Running pending load: " + this.pendingLoad);
            this.load(this.pendingLoad);
            this.pendingLoad = null;
          }
        },

        onStateChange: (e) => {
          const state = this._translateState(e.data);
          debugBus.player("GlobalPlayer → State: " + state);

          if (typeof this.onStateChange === "function") {
            this.onStateChange(state);
          }
        }
      }
    });
  }

  load(id) {
    if (!id) return;

    if (!this.ready) {
      debugBus.player("GlobalPlayer → Not ready, queuing load(" + id + ")");
      this.pendingLoad = id;
      return;
    }

    try {
      debugBus.player("GlobalPlayer → load(" + id + ")");
      this.player.loadVideoById(id);

      setTimeout(() => {
        try {
          this.player.setSize("100%", "100%");
          debugBus.player("GlobalPlayer → setSize after load");
        } catch {}
      }, 50);
    } catch (err) {
      debugBus.player("GlobalPlayer.load error: " + (err?.message || err));
    }
  }

  _translateState(code) {
    switch (code) {
      case window.YT.PlayerState.UNSTARTED:
        return "unstarted";
      case window.YT.PlayerState.ENDED:
        return "ended";
      case window.YT.PlayerState.PLAYING:
        return "playing";
      case window.YT.PlayerState.PAUSED:
        return "paused";
      case window.YT.PlayerState.BUFFERING:
        return "buffering";
      case window.YT.PlayerState.CUED:
        return "cued";
      default:
        return "unknown";
    }
  }
}

export const GlobalPlayer = new GlobalPlayerClass();
