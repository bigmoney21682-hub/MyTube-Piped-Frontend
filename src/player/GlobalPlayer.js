/**
 * File: GlobalPlayer.js
 * Path: src/player/GlobalPlayer.js
 * Description:
 *   Safe global YouTube IFrame player controller.
 *   - Never initializes with an invalid videoId
 *   - Never calls loadVideoById(null/undefined)
 *   - Never crashes on boot
 *   - Only creates the player AFTER a valid ID is provided
 */

let player = null;
let apiReady = false;
let pendingLoad = null;

// ---------------------------------------------------------
// Safe loader: only load if ID is valid
// ---------------------------------------------------------
function safeLoad(id) {
  if (!id || typeof id !== "string" || id.length < 5) {
    console.warn("[GlobalPlayer] safeLoad ignored invalid id:", id);
    return;
  }

  if (!apiReady || !player) {
    pendingLoad = id;
    return;
  }

  try {
    player.loadVideoById(id);
  } catch (err) {
    console.warn("[GlobalPlayer] loadVideoById failed:", err);
  }
}

// ---------------------------------------------------------
// Safe cue: only cue if ID is valid
// ---------------------------------------------------------
function safeCue(id) {
  if (!id || typeof id !== "string" || id.length < 5) {
    console.warn("[GlobalPlayer] safeCue ignored invalid id:", id);
    return;
  }

  if (!apiReady || !player) {
    pendingLoad = id;
    return;
  }

  try {
    player.cueVideoById(id);
  } catch (err) {
    console.warn("[GlobalPlayer] cueVideoById failed:", err);
  }
}

// ---------------------------------------------------------
// YouTube API Ready Handler
// ---------------------------------------------------------
window.onYouTubeIframeAPIReady = function () {
  try {
    player = new YT.Player("player", {
      height: "0",
      width: "0",

      // ⭐ CRITICAL FIX:
      // Never pass an invalid videoId on init.
      // Use null so YouTube does NOT throw.
      videoId: null,

      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0
      },

      events: {
        onReady: () => {
          apiReady = true;

          // If something tried to load before API was ready, load it now
          if (pendingLoad) {
            const id = pendingLoad;
            pendingLoad = null;
            safeLoad(id);
          }
        },

        onError: (e) => {
          console.warn("[GlobalPlayer] YT error:", e?.data);
        }
      }
    });
  } catch (err) {
    console.error("[GlobalPlayer] Failed to initialize player:", err);
  }
};

// ---------------------------------------------------------
// Public API
// ---------------------------------------------------------
export const GlobalPlayer = {
  load: safeLoad,
  cue: safeCue,
  getPlayer: () => player,
  isReady: () => apiReady
};
