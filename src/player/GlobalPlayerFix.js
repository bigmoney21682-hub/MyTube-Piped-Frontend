/**
 * File: GlobalPlayerFix.js
 * Path: src/player/GlobalPlayerFix.js
 * Description:
 *   Ensures YouTube Iframe API loads once globally.
 *   Adds full lifecycle debugging for iOS/Mac Web Inspector.
 */

// ------------------------------------------------------------
// Debug helper
// ------------------------------------------------------------
function dbg(label, data = {}) {
  console.group(`[PLAYER] ${label}`);
  for (const k in data) console.log(k + ":", data[k]);
  console.groupEnd();
}

dbg("GlobalPlayerFix loaded");

// ------------------------------------------------------------
// Load YouTube Iframe API once
// ------------------------------------------------------------
if (!window.YT) {
  dbg("Injecting YouTube Iframe API");

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

// ------------------------------------------------------------
// Global player object
// ------------------------------------------------------------
window.GlobalPlayer = {
  player: null,

  init() {
    dbg("init() called");

    if (this.player) {
      dbg("Player already exists");
      return;
    }

    this.player = new YT.Player("yt-player", {
      height: "100%",
      width: "100%",
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        controls: 1
      },
      events: {
        onReady: (e) => dbg("onReady", { event: e }),
        onStateChange: (e) => dbg("onStateChange", { state: e.data }),
        onError: (e) => dbg("onError", { error: e.data })
      }
    });
  },

  loadVideo(id) {
    dbg("loadVideo()", { id });

    if (!this.player) {
      dbg("Player missing — calling init()");
      this.init();
    }

    try {
      this.player.loadVideoById(id);
    } catch (err) {
      dbg("loadVideo() exception", { err });
    }
  }
};

// ------------------------------------------------------------
// YouTube API callback
// ------------------------------------------------------------
window.onYouTubeIframeAPIReady = () => {
  dbg("Iframe API Ready");
  window.GlobalPlayer.init();
};
