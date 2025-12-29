/**
 * File: GlobalPlayer.js
 * Path: src/player/GlobalPlayer.js
 * Description: Singleton wrapper around the YouTube IFrame Player API.
 *              Mounts directly into #player on the Watch page.
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

  /**
   * Initialize the YouTube player.
   * Called ONCE from PlayerContext.
   */
  init({ onReady, onStateChange }) {
    if (this._initStarted) {
      debugBus.player("GlobalPlayer → init() ignored (already started)");
      return;
    }

    this._initStarted = true;
    this.onReady = onReady;
    this.onStateChange = onStateChange;

    debugBus.player("GlobalPlayer → Waiting for YT API…");

    // YouTube API calls window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      debugBus.player("GlobalPlayer → YT API ready");
      this.ensureMounted();
    };

    // If API already loaded
    if (window.YT && window.YT.Player) {
      debugBus.player("GlobalPlayer → YT API already loaded");
      this.ensureMounted();
    }
  }

  /**
   * Ensure the player is created once #player exists.
   * Retries for a short window so it can wait for the Watch page DOM.
   */
  ensureMounted() {
    if (this.player) return;

    let attempts = 0;
    const maxAttempts = 30; // ~3 seconds
    const interval = setInterval(() => {
      const mount = document.getElementById("player");

      if (mount) {
        clearInterval(interval);
        this._createPlayer(mount);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        debugBus.player("GlobalPlayer → ERROR: #player never appeared");
      } else if (attempts === 1) {
        debugBus.player("GlobalPlayer → #player not found yet, will wait for Watch page");
      }
    }, 100);
  }

  /**
   * Create the player inside the given mount.
   */
  _createPlayer(mount) {
    if (this.player) {
      debugBus.player("GlobalPlayer → Player already exists (createPlayer)");
      return;
    }

    if (!mount) {
      debugBus.player("GlobalPlayer → ERROR: mount element missing");
      return;
    }

    debugBus.player("GlobalPlayer → Creating player in #player…");

    this.player = new window.YT.Player(mount, {
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

          try {
            this.player.setSize("100%", "100%");
            debugBus.player("GlobalPlayer → setSize(100%,100%) after init");
          } catch {}

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

  /**
   * Load a video by ID.
   * Safe to call before ready — it will queue.
   */
  load(id) {
    if (!id) return;

    // If no player yet, queue and ensure mount
    if (!this.player) {
      debugBus.player(
        "GlobalPlayer → No player yet, will wait for #player and queue load(" + id + ")"
      );
      this.pendingLoad = id;
      this.ensureMounted();
      return;
    }

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

  /**
   * Translate YT numeric states into readable strings.
   */
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
window.GlobalPlayer = GlobalPlayer;
