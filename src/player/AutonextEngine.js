/**
 * File: AutonextEngine.js
 * Path: src/player/AutonextEngine.js
 * Description: Handles autonext behavior when a video ends.
 *              Supports two modes:
 *                - "playlist": use QueueStore.next()
 *                - "related": notify PlayerContext/Watch.jsx to fetch related
 */

import { GlobalPlayer } from "./GlobalPlayer.js";
import { QueueStore } from "./QueueStore.jsx";
import { debugBus } from "../debug/debugBus.js";

let mode = "related"; // default
let relatedCallback = null; // Watch.jsx registers this
let initialized = false; // prevent double-binding

export const AutonextEngine = {
  /**
   * Initialize autonext engine.
   * Called once from PlayerContext after GlobalPlayer.init().
   */
  init() {
    if (initialized) {
      debugBus.player("AutonextEngine.init() skipped (already initialized)");
      return;
    }
    initialized = true;

    debugBus.player("AutonextEngine.init()");

    try {
      GlobalPlayer.onEnded(() => {
        debugBus.player("AutonextEngine → Video ended");

        // -----------------------------
        // PLAYLIST MODE
        // -----------------------------
        if (mode === "playlist") {
          let next = null;

          try {
            next = QueueStore.next?.() ?? null;
          } catch (err) {
            debugBus.player("AutonextEngine → QueueStore.next error: " + err?.message);
          }

          if (next) {
            debugBus.player("AutonextEngine → Playlist next: " + next);
            try {
              GlobalPlayer.load(next);
            } catch (err) {
              debugBus.player("AutonextEngine → GlobalPlayer.load error: " + err?.message);
            }
          } else {
            debugBus.player("AutonextEngine → Playlist ended (no next)");
          }

          return;
        }

        // -----------------------------
        // RELATED MODE
        // -----------------------------
        if (mode === "related") {
          debugBus.player("AutonextEngine → Related mode triggered");

          if (typeof relatedCallback === "function") {
            try {
              relatedCallback();
            } catch (err) {
              debugBus.player(
                "AutonextEngine → relatedCallback error: " + err?.message
              );
            }
          } else {
            debugBus.player(
              "AutonextEngine → No relatedCallback registered (Watch.jsx missing?)"
            );
          }
        }
      });
    } catch (err) {
      debugBus.player("AutonextEngine.init → GlobalPlayer.onEnded error: " + err?.message);
    }
  },

  /**
   * Set autonext mode: "playlist" or "related".
   */
  setMode(newMode) {
    mode = newMode;
    debugBus.player("AutonextEngine → Mode set to " + newMode);
  },

  /**
   * Register a callback for related-mode autonext.
   * Watch.jsx will call this and provide a function that:
   *   - fetches related videos
   *   - picks the next one
   *   - calls GlobalPlayer.load(id)
   */
  registerRelatedCallback(cb) {
    if (typeof cb !== "function") {
      debugBus.player("AutonextEngine → registerRelatedCallback ignored (not a function)");
      return;
    }

    relatedCallback = cb;
    debugBus.player("AutonextEngine → Related callback registered");
  }
};
