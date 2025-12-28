/**
 * File: QueueStore.js
 * Path: src/player/QueueStore.js
 * Description: Global queue manager for the playback engine.
 *              Pure JS store (not React), with subscription support.
 *              PlayerContext listens to this store for UI updates.
 */

import { debugBus } from "../debug/debugBus.js";

let queue = [];
let pointer = -1; // index of currently active item
let subscribers = [];

// ------------------------------------------------------------
// Internal helpers
// ------------------------------------------------------------

function notify() {
  subscribers.forEach((cb) => {
    try {
      cb(queue);
    } catch (err) {
      debugBus.player("QueueStore subscriber error: " + err?.message);
    }
  });
}

function clampPointer() {
  if (pointer >= queue.length) pointer = queue.length - 1;
  if (pointer < -1) pointer = -1;
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------

export const QueueStore = {
  /**
   * Subscribe to queue changes.
   */
  subscribe(cb) {
    if (typeof cb === "function") {
      subscribers.push(cb);
    }
  },

  /**
   * Get current queue array.
   */
  getQueue() {
    return queue;
  },

  /**
   * Add a video to the queue.
   */
  add(videoId) {
    if (!videoId) return;

    queue.push(videoId);
    debugBus.player("QueueStore → Added: " + videoId);

    // If nothing is playing yet, set pointer to first item
    if (pointer === -1) pointer = 0;

    notify();
  },

  /**
   * Remove a video from the queue.
   */
  remove(videoId) {
    const index = queue.indexOf(videoId);
    if (index === -1) return;

    queue.splice(index, 1);
    debugBus.player("QueueStore → Removed: " + videoId);

    if (pointer >= index) pointer -= 1;
    clampPointer();
    notify();
  },

  /**
   * Move an item within the queue.
   */
  move(from, to) {
    if (from < 0 || from >= queue.length) return;
    if (to < 0 || to >= queue.length) return;

    const item = queue.splice(from, 1)[0];
    queue.splice(to, 0, item);

    debugBus.player(`QueueStore → Moved ${item} from ${from} to ${to}`);

    if (pointer === from) pointer = to;
    clampPointer();
    notify();
  },

  /**
   * Clear the queue.
   */
  clear() {
    queue = [];
    pointer = -1;
    debugBus.player("QueueStore → Cleared");
    notify();
  },

  /**
   * Get the next video in queue.
   */
  next() {
    if (queue.length === 0) return null;

    if (pointer < queue.length - 1) {
      pointer += 1;
      const id = queue[pointer];
      debugBus.player("QueueStore → Next: " + id);
      notify();
      return id;
    }

    return null;
  },

  /**
   * Get the previous video in queue.
   */
  prev() {
    if (queue.length === 0) return null;

    if (pointer > 0) {
      pointer -= 1;
      const id = queue[pointer];
      debugBus.player("QueueStore → Prev: " + id);
      notify();
      return id;
    }

    return null;
  },

  /**
   * Get the currently pointed video.
   */
  current() {
    if (pointer === -1) return null;
    return queue[pointer] || null;
  }
};
