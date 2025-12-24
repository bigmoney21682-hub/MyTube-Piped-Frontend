// File: src/components/GlobalPlayer.jsx
// PCC v7.0 — FIXED YouTube API readiness + guaranteed player creation
// Single global YouTube iframe player (no Invidious, no <audio>)

import { useEffect, useRef } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function GlobalPlayer() {
  const {
    currentVideo,
    playing,
    playNext,
    setPlaying,
  } = usePlayer();

  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const apiReadyRef = useRef(false);

  const log = (msg) => window.debugLog?.(`GlobalPlayer(YT): ${msg}`);

  const getVideoId = (video) => {
    if (!video) return null;
    if (typeof video.id === "string") return video.id;
    if (typeof video.id?.videoId === "string") return video.id.videoId;
    return null;
  };

  const videoId = getVideoId(currentVideo);

  // -------------------------------
  // Load YouTube IFrame API once
  // -------------------------------
  useEffect(() => {
    // If API already loaded, do NOT mark ready yet — wait for onReady
    if (window.YT && window.YT.Player) {
      log("YouTube IFrame API already present — waiting for onReady");
      return;
    }

    if (window._ytApiLoading) {
      log("YouTube IFrame API loading already in progress");
      return;
    }

    log("Injecting YouTube IFrame API script");
    window._ytApiLoading = true;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      log("YouTube IFrame API ready");
      apiReadyRef.current = true;
    };
  }, []);

  // -------------------------------
  // Create the player once API is ready
  // -------------------------------
  useEffect(() => {
    if (!apiReadyRef.current) return;
    if (!containerRef.current) return;
    if (playerRef.current) return;

    log("Creating YouTube Player instance");

    playerRef.current = new window.YT.Player(containerRef.current, {
      width: "0",
      height: "0",
      videoId: null,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          log("YouTube player ready");
        },
        onStateChange: (event) => {
          const state = event.data;
          const YT = window.YT;
          if (!YT) return;

          if (state === YT.PlayerState.ENDED) {
            log("Player state = ENDED -> autonext");
            const next = playNext();
            if (!next) {
              log("No autonext target, stopping");
            }
          } else if (state === YT.PlayerState.PLAYING) {
            log("Player state = PLAYING");
            if (!playing) setPlaying(true);
          } else if (state === YT.PlayerState.PAUSED) {
            log("Player state = PAUSED");
            if (playing) setPlaying(false);
          }
        },
      },
    });
  }, [playNext, playing, setPlaying]);

  // -------------------------------
  // React to video changes
  // -------------------------------
  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      log("Video change ignored — player not ready yet");
      return;
    }

    if (!videoId) {
      log("No videoId -> stopping player");
      try {
        player.stopVideo();
      } catch (e) {}
      return;
    }

    log(`Loading videoId=${videoId} into global player`);
    try {
      player.loadVideoById(videoId);
      if (!playing) {
        player.pauseVideo();
      }
    } catch (e) {
      log(`Error loading videoId=${videoId}: ${e}`);
    }
  }, [videoId]);

  // -------------------------------
  // React to play/pause changes
  // -------------------------------
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (!videoId) {
      log("No videoId while toggling play/pause, skipping");
      return;
    }

    try {
      if (playing) {
        log("Context playing=true -> player.playVideo()");
        player.playVideo();
      } else {
        log("Context playing=false -> player.pauseVideo()");
        player.pauseVideo();
      }
    } catch (e) {
      log(`Error syncing play/pause: ${e}`);
    }
  }, [playing, videoId]);

  // Hidden player container
  return (
    <div
      style={{
        position: "fixed",
        width: 0,
        height: 0,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <div id="yt-global-player" ref={containerRef} />
    </div>
  );
}
