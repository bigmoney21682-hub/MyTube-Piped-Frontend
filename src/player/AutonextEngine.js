// File: src/player/AutonextEngine.js

import { debugBus } from "../debug/debugBus.js";

let mode = "related"; // "related" | "playlist"
let playlistCallback = null;
let relatedCallback = null;

export const AutonextEngine = {
  setMode(nextMode) {
    mode = nextMode;
    debugBus.log("AutonextEngine → mode set to " + mode);
  },

  registerPlaylistCallback(cb) {
    playlistCallback = cb;
    debugBus.log("Playlist callback registered");
  },

  registerRelatedCallback(cb) {
    relatedCallback = cb;
    debugBus.log("Related callback registered");
  },

  handleEnded() {
    debugBus.log("AutonextEngine → handleEnded, mode=" + mode);

    if (mode === "playlist" && playlistCallback) {
      playlistCallback();
      return;
    }

    if (mode === "related" && relatedCallback) {
      relatedCallback();
      return;
    }
  }
};
