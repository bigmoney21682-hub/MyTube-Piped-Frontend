// File: src/components/Player.jsx
import React, { forwardRef, useEffect } from "react";
import ReactPlayer from "react-player";

const Player = forwardRef(
  ({ embedUrl, playing, onEnded, pipMode, draggable, trackTitle }, ref) => {
    useEffect(() => {
      console.log("DEBUG: Player mounted", {
        embedUrl,
        playing,
        pipMode,
        draggable,
        trackTitle,
      });

      return () => {
        console.log("DEBUG: Player unmounted");
      };
    }, [embedUrl, playing, pipMode, draggable, trackTitle]);

    if (!embedUrl) {
      console.warn("DEBUG: Player embedUrl is empty");
      return null;
    }

    try {
      return (
        <ReactPlayer
          ref={ref}
          url={embedUrl}
          width="100%"       // Force visible width
          height="300px"     // Force visible height for iOS mount
          playing={playing}
          onEnded={onEnded}
          controls={true}   // enable controls for debugging
          volume={1}
          muted={false}
          playsinline={true} // iOS background playback
          style={{ borderRadius: pipMode ? 8 : 0 }}
        />
      );
    } catch (e) {
      console.error("DEBUG: Player error:", e);
      return null;
    }
  }
);

export default Player;
