/**
 * ------------------------------------------------------------
 * File: playVideo.js
 * Path: src/utils/playVideo.js
 * ------------------------------------------------------------
 */

import { GlobalPlayer } from "../player/GlobalPlayerFix.js";

export function playVideo({
  id,
  title,
  thumbnail,
  channel,
  player,
  playlistId = null,
  autonext = null
}) {
  if (!id || !player) {
    console.warn("playVideo() called without id or player context");
    return;
  }

  window.bootDebug?.player(`playVideo() → ${id}`);

  // ⭐ CRITICAL: update PlayerContext state
  player.loadVideo(id);

  // Still load into GlobalPlayer (iframe)
  GlobalPlayer.load(id);

  // Update metadata
  player.setPlayerMeta({
    title: title ?? "",
    thumbnail: thumbnail ?? "",
    channel: channel ?? ""
  });

  // Playlist context
  if (playlistId) {
    player.setActivePlaylistId(playlistId);
  }

  // Autonext mode
  if (autonext === "playlist") {
    player.setAutonextMode("playlist");
  } else if (autonext === "related") {
    player.setAutonextMode("related");
  } else if (autonext === "trending") {
    player.setAutonextMode("trending");
  }

  // Expand player
  player.expandPlayer();
}
