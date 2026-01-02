// File: src/player/GlobalPlayer.js

import { debugBus } from "../debug/debugBus.js";
import { AutonextEngine } from "./AutonextEngine.js";

let player = null;
let apiReady = false;
let pendingLoads = [];

/* ------------------------------------------------------------
   Called by YouTube API script
------------------------------------------------------------- */
window.onYouTubeIframeAPIReady = () => {
  debugBus.log("YouTube API ready (GlobalPlayer)");
  apiReady = true;

  pendingLoads.forEach((id) => GlobalPlayer.load(id));
  pendingLoads = [];
};

/* ------------------------------------------------------------
   Ensure player exists (lazy creation)
------------------------------------------------------------- */
function ensurePlayer() {
  if (!apiReady) return false;
  if (player) return true;

  const container = document.getElementById("player");
  if (!container) {
    setTimeout(ensurePlayer, 50);
    return false;
  }

  debugBus.log("Creating YT.Player");

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
      onReady: () => debugBus.log("Player ready"),
      onStateChange: (event) => {
        debugBus.log(String(event.data));

        if (event.data === window.YT.PlayerState.ENDED) {
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
    // no-op
  },

  load(id) {
    if (!id) return;

    if (!apiReady) {
      pendingLoads.push(id);
      return;
    }

    if (!ensurePlayer()) {
      pendingLoads.push(id);
      return;
    }

    debugBus.log("Loading video " + id);
    player.loadVideoById(id);
  }
};
