// File: src/components/GlobalPlayer.jsx
// PCC v1.0 — Global audio engine (Piped -> YouTube fallback, auto-next)

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function GlobalPlayer() {
  const {
    currentVideo,
    playing,
    playNext,
  } = usePlayer();

  const audioRef = useRef(null);

  const [audioSrc, setAudioSrc] = useState(null);
  const [sourceType, setSourceType] = useState("none"); // "none" | "piped" | "youtube"
  const [loading, setLoading] = useState(false);
  const [lastVideoId, setLastVideoId] = useState(null);

  const log = (msg) => window.debugLog?.(`GlobalPlayer: ${msg}`);

  // Helper to extract a YouTube video id from currentVideo
  const getVideoId = (video) => {
    if (!video) return null;
    if (typeof video.id === "string") return video.id;
    if (typeof video.id?.videoId === "string") return video.id.videoId;
    return null;
  };

  // ---------------------------------------------------------
  // Fetch Piped audio stream with YouTube fallback
  // ---------------------------------------------------------
  useEffect(() => {
    const videoId = getVideoId(currentVideo);

    if (!videoId) {
      log("No currentVideo or invalid id -> stopping");
      setAudioSrc(null);
      setSourceType("none");
      setLastVideoId(null);
      return;
    }

    // If we're already loaded for this video, don't refetch
    if (lastVideoId === videoId && audioSrc) {
      log(`Video id unchanged (${videoId}), reusing existing audioSrc`);
      return;
    }

    let cancelled = false;

    async function loadStream() {
      setLoading(true);
      setAudioSrc(null);
      setSourceType("none");
      setLastVideoId(videoId);

      // 1) Try Piped streams endpoint
      const pipedUrl = `https://pipedapi.kavin.rocks/streams/${videoId}`;
      log(`Trying Piped audio stream: ${pipedUrl}`);

      try {
        const res = await fetch(pipedUrl);
        const raw = await res.text();
        log(`Piped streams raw response: ${raw}`);

        if (cancelled) return;

        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          log(`Piped JSON parse error: ${err}`);
          data = null;
        }

        const audioStreams = data?.audioStreams;
        if (Array.isArray(audioStreams) && audioStreams.length > 0) {
          // Pick the first stream (usually highest quality)
          const best = audioStreams[0];
          log(
            `Piped audioStreams available: ${audioStreams.length}, using bitrate=${best.bitrate}, codec=${best.codec}`
          );
          setAudioSrc(best.url);
          setSourceType("piped");
          setLoading(false);
          return;
        } else {
          log("Piped returned no audioStreams, falling back to YouTube");
        }
      } catch (err) {
        log(`Piped streams fetch exception: ${err}`);
      }

      // 2) Fallback to YouTube iframe
      log("Falling back to YouTube iframe audio");
      setAudioSrc(null); // iframe will derive URL from id
      setSourceType("youtube");
      setLoading(false);
    }

    loadStream();

    return () => {
      cancelled = true;
    };
  }, [currentVideo]);

  // ---------------------------------------------------------
  // Sync play/pause with <audio> element
  // ---------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioSrc || sourceType !== "piped") return;

    if (playing) {
      audio
        .play()
        .then(() => {
          log("Audio play() resolved");
        })
        .catch((err) => {
          log(`Audio play() error: ${err}`);
        });
    } else {
      audio.pause();
      log("Audio paused due to playing=false");
    }
  }, [playing, audioSrc, sourceType]);

  // ---------------------------------------------------------
  // Handle auto-next on track end
  // ---------------------------------------------------------
  const handleEnded = () => {
    log("Audio ended -> calling playNext()");
    playNext();
  };

  const videoId = getVideoId(currentVideo);

  // No UI, just hidden playback engines
  return (
    <>
      {/* PIPED AUDIO ENGINE */}
      {sourceType === "piped" && audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          autoPlay={playing}
          onEnded={handleEnded}
          onError={(e) => {
            log(`Audio element error, falling back to YouTube: ${e.message || "unknown"}`);
            // If audio element fails, fall back to YouTube mode
            setSourceType("youtube");
          }}
        />
      )}

      {/* YOUTUBE IFRAME FALLBACK ENGINE */}
      {sourceType === "youtube" && videoId && (
        <iframe
          title="Global YouTube audio fallback"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${
            playing ? "1" : "0"
          }&mute=0`}
          style={{
            position: "fixed",
            width: 0,
            height: 0,
            border: "none",
            opacity: 0,
            pointerEvents: "none",
          }}
          allow="autoplay; encrypted-media"
        />
      )}

      {/* DEBUG STATE (optional if you ever want to surface) */}
      {false && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            fontSize: 10,
            color: "#fff",
            background: "rgba(0,0,0,0.7)",
            padding: 4,
            zIndex: 9999,
          }}
        >
          srcType={sourceType}, loading={String(loading)}
        </div>
      )}
    </>
  );
}
