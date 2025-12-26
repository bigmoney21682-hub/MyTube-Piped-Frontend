// File: src/components/GlobalPlayer.jsx
// PCC v13.0 — Full YouTube Engine + Metrics + Autonext
// Changes:
// - Added attachPlayerRef()
// - Added 250ms polling loop
// - Pushes duration/currentTime/buffered/state to PlayerContext
// - Human-readable states
// - Uses handleEnded() instead of manual playNext
// - Safe guards for same-video reload

import { useEffect, useRef } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function GlobalPlayer() {
  const {
    currentVideo,
    playing,
    handleEnded,
    setPlaying,
    setPlayerMetrics,
    attachPlayerRef,
  } = usePlayer();

  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const apiReadyRef = useRef(false);

  const log = (msg) => window.debugLog?.(`GlobalPlayer: ${msg}`);

  const getVideoId = (video) => {
    if (!video) return null;
    if (typeof video.id === "string") return video.id;
    if (typeof video.id?.videoId === "string") return video.id.videoId;
    return null;
  };

  const videoId = getVideoId(currentVideo);

  // ------------------------------------------------------------
  // LOAD YT API
  // ------------------------------------------------------------
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      apiReadyRef.current = true;
      return;
    }

    if (window._ytApiLoading) return;
    window._ytApiLoading = true;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      apiReadyRef.current = true;
    };
  }, []);

  // ------------------------------------------------------------
  // CREATE PLAYER
  // ------------------------------------------------------------
  useEffect(() => {
    if (!apiReadyRef.current) return;
    if (!containerRef.current) return;
    if (playerRef.current) return;

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
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
        showinfo: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          attachPlayerRef(playerRef.current);
        },
        onStateChange: (event) => {
          const YT = window.YT;
          if (!YT) return;

          const stateMap = {
            [YT.PlayerState.UNSTARTED]: "unstarted",
            [YT.PlayerState.ENDED]: "ended",
            [YT.PlayerState.PLAYING]: "playing",
            [YT.PlayerState.PAUSED]: "paused",
            [YT.PlayerState.BUFFERING]: "buffering",
            [YT.PlayerState.CUED]: "cued",
          };

          const readable = stateMap[event.data] || "unknown";

          setPlayerMetrics((m) => ({
            ...m,
            state: readable,
          }));

          if (readable === "ended") {
            handleEnded();
          } else if (readable === "playing") {
            setPlaying(true);
          } else if (readable === "paused") {
            setPlaying(false);
          }
        },
      },
    });
  }, [attachPlayerRef, handleEnded, setPlaying, setPlayerMetrics]);

  // ------------------------------------------------------------
  // LOAD VIDEO
  // ------------------------------------------------------------
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (!videoId) {
      try {
        player.stopVideo();
      } catch {}
      return;
    }

    try {
      const current = player.getVideoData()?.video_id;
      if (current === videoId) return;

      player.loadVideoById(videoId);
      if (!playing) player.pauseVideo();
    } catch {}
  }, [videoId]);

  // ------------------------------------------------------------
  // SYNC PLAY/PAUSE
  // ------------------------------------------------------------
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !videoId) return;

    try {
      if (playing) player.playVideo();
      else player.pauseVideo();
    } catch {}
  }, [playing, videoId]);

  // ------------------------------------------------------------
  // METRIC POLLING (250ms)
  // ------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      try {
        const duration = player.getDuration() || 0;
        const currentTime = player.getCurrentTime() || 0;

        let buffered = 0;
        const ranges = player.getVideoLoadedFraction?.();
        if (typeof ranges === "number") buffered = ranges;

        setPlayerMetrics((m) => ({
          ...m,
          duration,
          currentTime,
          buffered,
        }));
      } catch {}
    }, 250);

    return () => clearInterval(interval);
  }, [setPlayerMetrics]);

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
