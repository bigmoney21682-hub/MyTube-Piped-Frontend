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
    this._mountCheckInterval = null;
  }

  /**
   * Initialize the YouTube player.
   * Called ONCE from PlayerContext.
   */
  init({ onReady, onStateChange }) {
    if (this._initStarted) {
      debugBus.log("PLAYER", "GlobalPlayer → init() ignored (already started)");
      return;
    }

    this._initStarted = true;
    this.onReady = onReady;
    this.onStateChange = onStateChange;

    debugBus.log("PLAYER", "GlobalPlayer → Waiting for YT API…");

    // YouTube API calls window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      debugBus.log("PLAYER", "GlobalPlayer → YT API ready (callback)");
      this.ensureMounted();
    };

    // If API already loaded
    if (window.YT && window.YT.Player) {
      debugBus.log("PLAYER", "GlobalPlayer → YT API already loaded");
      this.ensureMounted();
    }
  }

  /**
   * Ensure the player is created once #player exists.
   * Retries for a short window so it can wait for the Watch page DOM.
   */
  ensureMounted() {
    if (this.player) {
      return;
    }

    if (this._mountCheckInterval) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 50; // ~5 seconds
    this._mountCheckInterval = setInterval(() => {
      const mount = document.getElementById("player");

      if (mount) {
        clearInterval(this._mountCheckInterval);
        this._mountCheckInterval = null;
        this._createPlayer(mount);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        clearInterval(this._mountCheckInterval);
        this._mountCheckInterval = null;
        debugBus.log("PLAYER", "GlobalPlayer → ERROR: #player never appeared");
      } else if (attempts === 1) {
        debugBus.log(
          "PLAYER",
          "GlobalPlayer → #player not found yet, will wait for Watch page"
        );
      }
    }, 100);
  }

  /**
   * Create the player inside the given mount.
   */
  _createPlayer(mount) {
    if (this.player) {
      debugBus.log("PLAYER", "GlobalPlayer → Player already exists (createPlayer)");
      return;
    }

    if (!mount) {
      debugBus.log("PLAYER", "GlobalPlayer → ERROR: mount element missing");
      return;
    }

    if (!window.YT || !window.YT.Player) {
      debugBus.log(
        "PLAYER",
        "GlobalPlayer → ERROR: YT API not ready in _createPlayer"
      );
      return;
    }

    debugBus.log("PLAYER", "GlobalPlayer → Creating player in #player…");

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
          debugBus.log("PLAYER", "GlobalPlayer → Player ready");
          this.ready = true;

          try {
            this.player.setSize("100%", "100%");
            debugBus.log(
              "PLAYER",
              "GlobalPlayer → setSize(100%,100%) after init"
            );
          } catch {}

          if (typeof this.onReady === "function") {
            this.onReady();
          }

          if (this.pendingLoad) {
            const id = this.pendingLoad;
            this.pendingLoad = null;
            debugBus.log(
              "PLAYER",
              "GlobalPlayer → Running pending load after ready: " + id
            );
            this._safeLoadNow(id);
          }
        },

        onStateChange: (e) => {
          const state = this._translateState(e.data);
          debugBus.log("PLAYER", "GlobalPlayer → State: " + state);

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
      debugBus.log(
        "PLAYER",
        "GlobalPlayer → No player yet, will wait for #player and queue load(" +
          id +
          ")"
      );
      this.pendingLoad = id;
      this.ensureMounted();
      return;
    }

    if (!this.ready) {
      debugBus.log(
        "PLAYER",
        "GlobalPlayer → Not ready, queuing load(" + id + ")"
      );
      this.pendingLoad = id;
      return;
    }

    this._safeLoadNow(id);
  }

  /**
   * Internal: actually call loadVideoById safely.
   */
  _safeLoadNow(id) {
    try {
      if (!this.player || !this.ready) {
        debugBus.log(
          "PLAYER",
          "GlobalPlayer → _safeLoadNow called but player not ready, re-queuing " +
            id
        );
        this.pendingLoad = id;
        return;
      }

      debugBus.log("PLAYER", "GlobalPlayer → load(" + id + ")");
      this.player.loadVideoById(id);

      setTimeout(() => {
        try {
          this.player.setSize("100%", "100%");
          debugBus.log("PLAYER", "GlobalPlayer → setSize after load");
        } catch {}
      }, 50);
    } catch (err) {
      debugBus.log(
        "PLAYER",
        "GlobalPlayer.load error: " + (err?.message || err)
      );
    }
  }

  /**
   * Translate YT numeric states into readable strings.
   */
  _translateState(code) {
    if (!window.YT || !window.YT.PlayerState) return "unknown";

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
