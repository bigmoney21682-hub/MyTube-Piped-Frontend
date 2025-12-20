import React, { forwardRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

const Player = forwardRef(
  ({ embedUrl, playing, onEnded, pipMode, trackTitle }, ref) => {
  const [isPip, setIsPip] = useState(pipMode || false);
  const [adOverlayActive, setAdOverlayActive] = useState(true);

  // End ad overlay after fixed duration (simulate ad skip)
  useEffect(() => {
    const timer = setTimeout(() => setAdOverlayActive(false), 4000); // 4s ad simulation
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Main ReactPlayer */}
      <ReactPlayer
        ref={ref}
        url={embedUrl}
        width={isPip ? "320px" : "100%"}
        height={isPip ? "180px" : "400px"}
        playing={playing}
        controls={!isPip}
        volume={1}
        muted={adOverlayActive} // mute during simulated ad
        pip={isPip} // iOS PWA native PIP
        playsinline
        onEnded={onEnded}
        style={{
          position: isPip ? "fixed" : "relative",
          bottom: isPip ? 80 : 0,
          right: isPip ? 16 : 0,
          zIndex: isPip ? 9999 : "auto",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: isPip ? "0 0 12px rgba(0,0,0,0.5)" : "none",
        }}
      />

      {/* Mini-player overlay info */}
      {isPip && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 16,
            zIndex: 10000,
            background: "#111",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 12,
            pointerEvents: "none",
          }}
        >
          🎵 {trackTitle} {adOverlayActive ? "(Ad…)" : ""}
        </div>
      )}
    </>
  );
  }
);

export default Player;
