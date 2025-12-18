import { useRef, useState, useEffect } from "react";

/**
 * Player.jsx
 *
 * Responsibilities:
 * - Play a given src safely (Safari + yt-dlp friendly)
 * - Detect truly unplayable videos
 * - Skip EXACTLY ONCE when needed
 * - NEVER loop or re-trigger errors
 */

export default function Player({ src, title, onEnded, isSafariPlayable }) {
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const hasSkippedRef = useRef(false);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Reset state on NEW src
    setErrorMessage(null);
    hasSkippedRef.current = false;
    clearTimeout(timeoutRef.current);

    if (!src) return;

    // 🔒 HARD STOP: known-unplayable (pre-filtered)
    if (isSafariPlayable === false) {
      triggerSkip("This video can’t be played. Skipping…");
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Force reload for Safari reliability
    try {
      video.pause();
      video.load();
      video.play().catch(() => {});
    } catch {}

    /**
     * ⏱ SAFETY TIMEOUT
     * Only skip if:
     * - video never started
     * - not ended
     * - still not enough data
     */
    timeoutRef.current = setTimeout(() => {
      if (
        video.currentTime < 1 &&
        !video.ended &&
        video.readyState < 3
      ) {
        handlePlaybackIssue({ type: "timeout" });
      }
    }, 8000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [src, isSafariPlayable]);

  /**
   * CENTRALIZED SKIP LOGIC
   * Guarantees skip happens ONCE
   */
  const triggerSkip = (message) => {
    if (hasSkippedRef.current) return;

    hasSkippedRef.current = true;
    setErrorMessage(message);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
      if (onEnded) onEnded();
    }, 1500);
  };

  /**
   * MEDIA FAILURE HANDLER
   */
  const handlePlaybackIssue = (e) => {
    if (hasSkippedRef.current) return;

    console.warn("Playback issue:", e?.type || "unknown");

    triggerSkip("This video can’t be played. Skipping…");
  };

  if (!src) return null;

  return (
    <div style={{ position: "relative", width: "100%", background: "#000" }}>
      <video
        ref={videoRef}
        src={src}
        controls
        autoPlay
        playsInline
        preload="auto"
        style={{ width: "100%", display: "block" }}
        onEnded={() => {
          if (!hasSkippedRef.current && onEnded) onEnded();
        }}
        onError={handlePlaybackIssue}
        onStalled={handlePlaybackIssue}
        onAbort={handlePlaybackIssue}
        onSuspend={handlePlaybackIssue}
        onEmptied={handlePlaybackIssue}
      />

      {errorMessage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.85)",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "1.05rem",
            fontWeight: 500,
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
