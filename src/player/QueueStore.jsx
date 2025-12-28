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

function safeNotify() {
  // Snapshot to avoid mutation during iteration
  const subs = [...subscribers];

  for (const cb of subs) {
    try {
      cb([...queue]); // always send a copy
    } catch (err) {
      debugBus.player("QueueStore subscriber error: " + (err?.message || err));
    }
  }
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
    if (typeof cb !== "function") return;

    // Prevent duplicate subscriptions
    if (!subscribers.includes(cb)) {
      subscribers.push(cb);
    }
  },

  /**
   * Get current queue array (safe copy).
   */
  getQueue() {
    try {
      return [...queue];
    } catch {
      return [];
    }
  },

  /**
   * Add a video to the queue.
   */
  add(videoId) {
    try {
      if (!videoId || typeof videoId !== "string") return;

      queue.push(videoId);
      debugBus.player("QueueStore → Added: " + videoId);

      // If nothing is playing yet, set pointer to first item
      if (pointer === -1) pointer = 0;

      clampPointer();
      safeNotify();
    } catch (err) {
      debugBus.player("QueueStore.add error: " + (err?.message || err));
    }
  },

  /**
   * Remove a video from the queue.
   */
  remove(videoId) {
    try {
      const index = queue.indexOf(videoId);
      if (index === -1) return;

      queue.splice(index, 1);
      debugBus.player("QueueStore → Removed: " + videoId);

      if (pointer >= index) pointer -= 1;

      clampPointer();
      safeNotify();
    } catch (err) {
      debugBus.player("QueueStore.remove error: " + (err?.message || err));
    }
  },

  /**
   * Move an item within the queue.
   */
  move(from, to) {
    try {
      if (
        typeof from !== "number" ||
        typeof to !== "number" ||
        from < 0 ||
        to < 0 ||
        from >= queue.length ||
        to >= queue.length
      ) {
        return;
      }

      const item = queue[from];
      if (!item) return;

      queue.splice(from, 1);
      queue.splice(to, 0, item);

      debugBus.player(`QueueStore → Moved ${item} from ${from} to ${to}`);

      if (pointer === from) pointer = to;

      clampPointer();
      safeNotify();
    } catch (err) {
      debugBus.player("QueueStore.move error: " + (err?.message || err));
    }
  },

  /**
   * Clear the queue.
   */
  clear() {
    try {
      queue = [];
      pointer = -1;
      debugBus.player("QueueStore → Cleared");
      safeNotify();
    } catch (err) {
      debugBus.player("QueueStore.clear error: " + (err?.message || err));
    }
  },

  /**
   * Get the next video in queue.
   */
  next() {
    try {
      if (queue.length === 0) return null;

      if (pointer < queue.length - 1) {
        pointer += 1;
        clampPointer();

        const id = queue[pointer] ?? null;
        debugBus.player("QueueStore → Next: " + id);

        safeNotify();
        return id;
      }

      return null;
    } catch (err) {
      debugBus.player("QueueStore.next error: " + (err?.message || err));
      return null;
    }
  },

  /**
   * Get the previous video in queue.
   */
  prev() {
    try {
      if (queue.length === 0) return null;

      if (pointer > 0) {
        pointer -= 1;
        clampPointer();

        const id = queue[pointer] ?? null;
        debugBus.player("QueueStore → Prev: " + id);

        safeNotify();
        return id;
      }

      return null;
    } catch (err) {
      debugBus.player("QueueStore.prev error: " + (err?.message || err));
      return null;
    }
  },

  /**
   * Get the currently pointed video.
   */
  current() {
    try {
      if (pointer === -1) return null;
      return queue[pointer] ?? null;
    } catch {
      return null;
    }
  }
};
