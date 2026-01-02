// File: src/player/GlobalPlayer.js

import { debugBus } from "../debug/debugBus.js";
import { AutonextEngine } from "./AutonextEngine.js";

let player = null;
let apiReady = false;
let pendingLoads = [];

/* ------------------------------------------------------------
   YouTube API Ready
------------------------------------------------------------- */
function onYouTubeIframeAPIReady() {
  debugBus.log("YouTube API ready");
  apiReady = true;

  // Do NOT create the player here.
  // We will create it lazily on first load(), once #player exists.
  pendingLoads.forEach((id) => load(id));
  pendingLoads = [];
}

/* ------------------------------------------------------------
   Inject YouTube IFrame API script (once)
------------------------------------------------------------- */
if (typeof window !== "undefined") {
  if (!window.onYouTubeIframeAPIReady) {
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  }

  if (!document.getElementById("youtube-iframe-api")) {
    const tag = document.createElement("script");
    tag.id = "youtube-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }
}

/* ------------------------------------------------------------
   Internal: ensure player exists
------------------------------------------------------------- */
function ensurePlayer() {
  if (!apiReady) return false;
  if (player) return true;

  const container = document.getElementById("player");
  if (!container) {
    debugBus.log("GlobalPlayer.ensurePlayer → #player not in DOM yet");
    return false;
  }

  player = new window.YT.Player("player", {
    height: "220",
    width: "100%",
    videoId: "",
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      playsinline: 1
    },
    events: {
      onReady: () => {
        debugBus.log("Player ready");
      },
      onStateChange: (event) => {
        debugBus.log(String(event.data));

        if (event.data === window.YT.PlayerState.ENDED) {
          debugBus.log(
            "Player state → ENDED, calling AutonextEngine.handleEnded()"
          );
          AutonextEngine.handleEnded();
        }
      },
      onError: (event) => {
        debugBus.error("Player error", event.data);
      }
    }
  });

  return true;
}

/* ------------------------------------------------------------
   GlobalPlayer API
------------------------------------------------------------- */
export const GlobalPlayer = {
  ensureMounted() {
    // no-op; #player div in Watch.jsx is enough
  },

  load(id) {
    if (!id) return;

    if (!apiReady) {
      debugBus.log("YT API not ready, queueing load(" + id + ")");
      pendingLoads.push(id);
      return;
    }

    if (!ensurePlayer()) {
      debugBus.log("Player not ready, queueing load(" + id + ")");
      pendingLoads.push(id);
      return;
    }

    debugBus.log("Loading video " + id);
    try {
      player.loadVideoById(id);
    } catch (err) {
      debugBus.error("GlobalPlayer.load error:", err);
    }
  }
};
