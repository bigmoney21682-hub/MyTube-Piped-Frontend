/**
 * File: AutonextEngine.js
 * Path: src/player/AutonextEngine.js
 * Description: Handles autonext logic for related + playlist modes.
 */

import { debugBus } from "../debug/debugBus.js";

let mode = "related";
let relatedCallback = null;
let playlistCallback = null;

export const AutonextEngine = {
  /* ------------------------------------------------------------
     Set mode (related | playlist)
  ------------------------------------------------------------- */
  setMode(m) {
    mode = m;
    debugBus.log("AutonextEngine", `Mode set → ${mode}`);
  },

  /* ------------------------------------------------------------
     Register related-mode callback
  ------------------------------------------------------------- */
  registerRelatedCallback(cb) {
    relatedCallback = cb;
  },

  /* ------------------------------------------------------------
     Register playlist-mode callback
  ------------------------------------------------------------- */
  registerPlaylistCallback(cb) {
    playlistCallback = cb;
  },

  /* ------------------------------------------------------------
     Trigger autonext
  ------------------------------------------------------------- */
  trigger() {
    debugBus.log("AutonextEngine", `Triggering callback for mode="${mode}"`);

    if (mode === "playlist") {
      if (playlistCallback) {
        playlistCallback();
      } else {
        debugBus.log("AutonextEngine", "No playlist callback registered");
      }
      return;
    }

    // Related mode
    if (relatedCallback) {
      relatedCallback();
    } else {
      debugBus.log("AutonextEngine", "No related callback registered");
    }
  }
};
