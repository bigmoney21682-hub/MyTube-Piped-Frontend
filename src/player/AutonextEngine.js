/**
 * File: src/player/AutonextEngine.js
 * Description:
 *   Autonext engine for the new Home-as-Master architecture.
 *   - No Watch.jsx required
 *   - No callback registration required
 *   - Uses a dynamic "source list" + "currentId" + "loadVideo"
 */

import { debugBus } from "../debug/debugBus.js";

let getState = null;   // function returning { source, items, currentId, loadVideo }

/**
 * Register a state getter from Home.jsx or PlayerContext
 */
function registerStateGetter(fn) {
  getState = typeof fn === "function" ? fn : null;
  debugBus.player(getState ? "AutonextEngine state getter registered" : "AutonextEngine state getter cleared");
}

/**
 * Called by GlobalPlayerFix when the video ends.
 */
function handleEnded() {
  debugBus.player("AutonextEngine → handleEnded()");

  if (!getState) {
    debugBus.error("AutonextEngine → No state getter registered");
    return;
  }

  const { source, items, currentId, loadVideo } = getState();

  if (!items || !items.length) {
    debugBus.player("AutonextEngine → No items for source:", source);
    return;
  }

  // Find current index
  const index = items.findIndex((v) => {
    const id = v.id || v.videoId;
    return id === currentId;
  });

  if (index === -1) {
    debugBus.player("AutonextEngine → Current video not found in list");
    return;
  }

  // Next index
  const nextIndex = index + 1;

  if (nextIndex >= items.length) {
    debugBus.player("AutonextEngine → End of list reached");
    return;
  }

  const next = items[nextIndex];
  const nextId = next.id || next.videoId;

  if (!nextId) {
    debugBus.error("AutonextEngine → Invalid next video", next);
    return;
  }

  debugBus.player(`AutonextEngine → Playing next video (${source}): ${nextId}`);
  loadVideo(nextId);
}

/**
 * Export API
 */
export const AutonextEngine = {
  registerStateGetter,
  handleEnded
};
