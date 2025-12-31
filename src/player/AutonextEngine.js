/**
 * File: AutonextEngine.js
 * Path: src/player/AutonextEngine.js
 * Description: Centralized autonext dispatcher for "related" mode.
 *              Allows Watch.jsx to register a single callback that fires
 *              when the current video ends AND autonextMode === "related".
 *
 *              Guarantees:
 *              - Only ONE callback is ever registered
 *              - No stale closures
 *              - No double triggers
 *              - No crashes if callback missing
 */

class AutonextEngineClass {
  constructor() {
    this.relatedCallback = null;
  }

  /**
   * Register the callback for "related" autonext mode.
   * This is called ONCE from Watch.jsx.
   */
  registerRelatedCallback(cb) {
    if (typeof cb !== "function") {
      window.bootDebug?.player(
        "AutonextEngine → registerRelatedCallback ignored (not a function)"
      );
      return;
    }

    this.relatedCallback = cb;
    window.bootDebug?.player("AutonextEngine → related callback registered");
  }

  /**
   * Trigger the related callback.
   * Called by PlayerContext when the video ends AND autonextMode === "related".
   */
  triggerRelated() {
    if (!this.relatedCallback) {
      window.bootDebug?.player("AutonextEngine → No related callback registered");
      return;
    }

    try {
      window.bootDebug?.player("AutonextEngine → Triggering related callback");
      this.relatedCallback();
    } catch (err) {
      window.bootDebug?.player(
        "AutonextEngine → Error in related callback: " +
          (err?.message || err)
      );
    }
  }
}

export const AutonextEngine = new AutonextEngineClass();
