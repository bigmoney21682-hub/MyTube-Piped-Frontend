/**
 * ------------------------------------------------------------
 *  File: GlobalPlayer_v2.js  jjj
 *  Path: src/player/GlobalPlayer_v2.js
 *  Description:
 *    Global YouTube player singleton with deep diagnostics.
 *    Adds detailed logging for:
 *      - DOM container existence
 *      - CSP visibility
 *      - YT API readiness
 *      - iframe creation attempts
 *      - loadVideoById failures
 *    Restores the GlobalPlayer.init + GlobalPlayer.load API
 *    expected by PlayerContext and App.jsx.
 * ------------------------------------------------------------
 */

window.bootDebug?.player("GlobalPlayer_v2.js → FILE LOADED");
console.log("GlobalPlayer_v2.js → FILE LOADED");


let player = null;
let isReady = false;
let pendingVideoId = null;

function log(...args) {
  console.log("[GlobalPlayer]", ...args);
}

function logError(...args) {
  console.error("[GlobalPlayer][ERROR]", ...args);
}

/**
 * Check if #player exists and log its dimensions.
 */
function getPlayerContainer() {
  const el = document.getElementById("player");
  if (!el) {
    logError("DOM → #player NOT FOUND at time of check");
  } else {
    const rect = el.getBoundingClientRect();
    log("DOM → #player FOUND", {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    });
  }
  return el;
}

/**
 * Log environment details: YT globals, CSP, document state.
 */
function debugEnvironment() {
  log("ENV → window.YT:", !!window.YT, "window.YT.Player:", !!(window.YT && window.YT.Player));
  log("ENV → document.readyState:", document.readyState);
  log("ENV → location.href:", window.location.href);

  try {
    const metas = Array.from(
      document.querySelectorAll("meta[http-equiv='Content-Security-Policy']")
    ).map(m => m.getAttribute("content"));
    log("ENV → CSP meta tags:", metas);
  } catch (e) {
    logError("ENV → Failed to read CSP meta tags:", e);
  }
}

/**
 * Initialize the global YouTube player.
 */
export function initGlobalPlayer() {
  log("initGlobalPlayer() called");

  debugEnvironment();

  const container = getPlayerContainer();
  if (!container) {
    logError("INIT → Aborting: #player container missing");
    return;
  }

  if (!window.YT || !window.YT.Player) {
    logError("INIT → Aborting: YT or YT.Player not available at init time", {
      hasYT: !!window.YT,
      hasYTPlayer: !!(window.YT && window.YT.Player)
    });
    return;
  }

  try {
    log("INIT → Creating YT.Player instance with id 'player'");
    player = new window.YT.Player("player", {
      height: "220",
      width: "100%",
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: () => {
          log("EVENT → onReady fired");
          isReady = true;

          if (pendingVideoId) {
            const vid = pendingVideoId;
            pendingVideoId = null;
            log("EVENT → onReady → pendingVideoId found, loading:", vid);
            safeLoadVideoById(vid);
          }
        },
        onError: (event) => {
          logError("EVENT → onError from YT.Player", event && event.data);
        },
        onStateChange: (event) => {
          log("EVENT → onStateChange", event && event.data);
        }
      }
    });

    if (!player || typeof player.loadVideoById !== "function") {
      logError("INIT → YT.Player instance INVALID right after construction", {
        playerType: typeof player,
        keys: player ? Object.keys(player) : null
      });
    } else {
      log("INIT → YT.Player instance created successfully (has loadVideoById)");
    }
  } catch (err) {
    logError("INIT → Exception while creating YT.Player", err);
  }
}

/**
 * Safely call loadVideoById with diagnostics.
 */
function safeLoadVideoById(videoId) {
  log("LOAD → safeLoadVideoById called with:", videoId);

  if (!player) {
    logError("LOAD → Aborting: player is null/undefined");
    debugEnvironment();
    getPlayerContainer();
    return;
  }

  if (typeof player.loadVideoById !== "function") {
    logError("LOAD → Aborting: player.loadVideoById is not a function", {
      playerType: typeof player,
      keys: Object.keys(player || {})
    });
    return;
  }

  try {
    log("LOAD → Calling player.loadVideoById:", videoId);
    player.loadVideoById(videoId);
    log("LOAD → player.loadVideoById call returned (no exception)");
  } catch (err) {
    logError("LOAD → Exception during player.loadVideoById", err);
    debugEnvironment();
    getPlayerContainer();
  }
}

/**
 * Public load() API used by PlayerContext.
 */
export function load(videoId) {
  log("API → load() called with:", videoId);

  if (!player || !isReady) {
    log("API → Player not ready yet. Stashing pendingVideoId:", videoId, {
      hasPlayer: !!player,
      isReady
    });
    pendingVideoId = videoId;
    return;
  }

  safeLoadVideoById(videoId);
}

/**
 * ------------------------------------------------------------
 * Public API wrapper (matches old interface)
 * ------------------------------------------------------------
 */
export const GlobalPlayer = {
  init: initGlobalPlayer,
  load
};

/**
 * Debug hooks for console inspection.
 */
window.__GlobalPlayerDebug = {
  initGlobalPlayer,
  load,
  getPlayerContainer,
  debugEnvironment,
  get player() {
    return player;
  },
  get isReady() {
    return isReady;
  }
};
