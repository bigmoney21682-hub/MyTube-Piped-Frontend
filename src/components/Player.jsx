// File: src/components/Player.jsx
// PCC v2.2 — Video player component (ReactPlayer), controlled by Watch page

import React, { forwardRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";

const Player = forwardRef(
  (
    {
      embedUrl,
      playing,
      onEnded,
      pipMode,
      draggable,
      trackTitle,
      onSeekRelative,
      onPrev,
      onNext,
    },
    ref
  ) => {
    const [isAdPlaying, setIsAdPlaying] = useState(false);
    const [videoVolume, setVideoVolume] = useState(1);
    const [adOverlayVisible, setAdOverlayVisible] = useState(false);

    useEffect(() => {
      window.debugLog?.(
        `DEBUG: Player mounted - embedUrl: ${embedUrl}, playing: ${playing}`
      );
      return () => {
        window.debugLog?.("DEBUG: Player unmounted");
      };
    }, [embedUrl, playing]);

    if (!embedUrl) {
      window.debugLog?.("DEBUG: Player embedUrl is empty");
      return null;
    }

    const handleProgress = (state) => {
      if (state?.playingAd || state?.ad) {
        setIsAdPlaying(true);
        setAdOverlayVisible(true);
        setVideoVolume(0);
      } else if (isAdPlaying) {
        setIsAdPlaying(false);
        setAdOverlayVisible(false);
        setVideoVolume(1);
      }
    };

    const handleStart = () => {
      setIsAdPlaying(false);
      setAdOverlayVisible(false);
      setVideoVolume(1);
    };

    return (
      <div style={{ position: "relative", width: "100%", background: "#000" }}>
        {adOverlayVisible && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#000",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "#555", fontSize: 18 }}>Loading video...</p>
          </div>
        )}

        {!playing && !adOverlayVisible && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              background: "rgba(0,0,0,0.35)",
            }}
          >
            <button
              onClick={() => onSeekRelative?.(-15)}
              style={controlButtonStyle}
            >
              ⏪ 15s
            </button>
            <button onClick={onPrev} style={controlButtonStyle}>
              ⏮ Prev
            </button>
            <button
              onClick={() => onSeekRelative?.(15)}
              style={controlButtonStyle}
            >
              15s ⏩
            </button>
            <button onClick={onNext} style={controlButtonStyle}>
              ⏭ Next
            </button>
          </div>
        )}

        <ReactPlayer
          ref={ref}
          url={embedUrl}
          width="100%"
          height={pipMode ? "260px" : "360px"}
          playing={playing}
          onEnded={onEnded}
          controls={false}
          volume={videoVolume}
          muted={false}
          playsinline={true}
          style={{ borderRadius: pipMode ? 8 : 0 }}
          progressInterval={500}
          onProgress={handleProgress}
          onStart={handleStart}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
              },
            },
          }}
        />
      </div>
    );
  }
);

const controlButtonStyle = {
  background: "rgba(0,0,0,0.7)",
  border: "1px solid #fff",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 999,
  fontSize: 14,
  cursor: "pointer",
};

export default Player;
