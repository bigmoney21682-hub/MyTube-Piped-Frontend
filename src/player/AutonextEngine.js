/**
 * File: AutonextEngine.js
 * Path: src/player/AutonextEngine.js
 * Description: Centralized autonext dispatcher for multiple modes.
 *
 * Supports:
 *   - "related"
 *   - "playlist"
 *   - "trending" (placeholder)
 *   - "music" (placeholder)
 *
 * Guarantees:
 *   - Only ONE callback per mode
 *   - No stale closures
 *   - No double triggers
 *   - No crashes if callback missing
 */

class AutonextEngineClass {
  constructor() {
    // Each mode gets its own callback
    this.callbacks = {
      related: null,
      playlist: null,
      trending: null,
      music: null
    };
  }

  /**
   * Register a callback for a specific autonext mode.
   * Example:
   *   AutonextEngine.register("related", () => { ... })
   */
  register(mode, cb) {
    if (typeof cb !== "function") {
      window.bootDebug?.player(
        `AutonextEngine → register(${mode}) ignored (not a function)`
      );
      return;
    }

    if (!this.callbacks.hasOwnProperty(mode)) {
      window.bootDebug?.player(
        `AutonextEngine → register(${mode}) ignored (unknown mode)`
      );
      return;
    }

    this.callbacks[mode] = cb;
    window.bootDebug?.player(
      `AutonextEngine → callback registered for mode="${mode}"`
    );
  }

  /**
   * Trigger autonext for the given mode.
   * Called by PlayerContext when the video ends.
   */
  trigger(mode) {
    const cb = this.callbacks[mode];

    if (!cb) {
      window.bootDebug?.player(
        `AutonextEngine → No callback registered for mode="${mode}"`
      );
      return;
    }

    try {
      window.bootDebug?.player(
        `AutonextEngine → Triggering callback for mode="${mode}"`
      );
      cb();
    } catch (err) {
      window.bootDebug?.player(
        `AutonextEngine → Error in ${mode} callback: ${err?.message || err}`
      );
    }
  }

  /**
   * Convenience: legacy API for "related" mode.
   * Keeps your existing Watch.jsx code working.
   */
  registerRelatedCallback(cb) {
    this.register("related", cb);
  }

  triggerRelated() {
    this.trigger("related");
  }
}

export const AutonextEngine = new AutonextEngineClass();
window.AutonextEngine = AutonextEngine;
