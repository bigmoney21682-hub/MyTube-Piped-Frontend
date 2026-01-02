/**
 * File: src/player/AutonextEngine.js
 * Description:
 *   Central autonext dispatcher.
 *   Watch.jsx registers:
 *     - playlist callback
 *     - related callback
 *     - trending callback (merged into related handler)
 *
 *   When the YouTube player ends, GlobalPlayer calls:
 *       AutonextEngine.handleEnded()
 *
 *   This engine then calls the active callback.
 */

import { debugBus } from "../debug/debugBus.js";

let playlistCallback = null;
let relatedCallback = null;

/**
 * Register playlist autonext handler
 */
function registerPlaylistCallback(fn) {
  playlistCallback = typeof fn === "function" ? fn : null;
  debugBus.player(
    fn ? "Playlist callback registered" : "Playlist callback cleared"
  );
}

/**
 * Register related/trending autonext handler
 * (Watch.jsx handles trending inside the related handler)
 */
function registerRelatedCallback(fn) {
  relatedCallback = typeof fn === "function" ? fn : null;
  debugBus.player(
    fn ? "Related callback registered" : "Related callback cleared"
  );
}

/**
 * Called by GlobalPlayer when the video ends.
 * Dispatches to whichever callback is active.
 */
function handleEnded() {
  debugBus.player("AutonextEngine → handleEnded()");

  // Playlist takes priority if registered
  if (playlistCallback) {
    try {
      playlistCallback();
    } catch (err) {
      debugBus.error("AutonextEngine playlist callback error", err);
    }
    return;
  }

  // Otherwise use related/trending
  if (relatedCallback) {
    try {
      relatedCallback();
    } catch (err) {
      debugBus.error("AutonextEngine related callback error", err);
    }
    return;
  }

  debugBus.player("AutonextEngine → no callback registered");
}

/**
 * Export API
 */
export const AutonextEngine = {
  registerPlaylistCallback,
  registerRelatedCallback,
  handleEnded
};
