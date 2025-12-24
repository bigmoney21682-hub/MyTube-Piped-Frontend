// File: src/components/GlobalPlayer.jsx
// PCC v7.1 — Overlay-free YouTube player (no links, no share, no title)
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
        controls: 0,        // no controls
        rel: 0,             // no related videos
        modestbranding: 1,  // no YouTube logo
        playsinline: 1,
        fs: 0,              // no fullscreen button
        iv_load_policy: 3,  // no annotations
        disablekb: 1,       // no keyboard shortcuts
        showinfo: 0,        // hide title/channel
        origin: window.location.origin,
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
            if (!next) log("No autonext target, stopping");
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
      if (!playing) player.pauseVideo();
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
