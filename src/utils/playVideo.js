/**
 * ------------------------------------------------------------
 * File: playVideo.js
 * Path: src/utils/playVideo.js
 * Description:
 *   Legacy helper removed — replaced with unified player logic.
 *   Uses new PlayerContext API + window.GlobalPlayer.
 * ------------------------------------------------------------
 */

export function playVideo({ id, player }) {
  if (!id || !player) {
    console.warn("playVideo() called without id or player context");
    return;
  }

  console.log("[playVideo] →", id);

  // Update PlayerContext state
  player.loadVideo(id);

  // Load into iframe player
  if (window.GlobalPlayer) {
    window.GlobalPlayer.loadVideo(id);
  } else {
    console.warn("[playVideo] GlobalPlayer missing");
  }
}
