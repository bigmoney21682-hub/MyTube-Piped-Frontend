// File: src/components/Player.jsx
import React, { forwardRef, useEffect } from "react";
import ReactPlayer from "react-player";

const Player = forwardRef(
  ({ embedUrl, playing, onEnded, pipMode, draggable, trackTitle }, ref) => {
    useEffect(() => {
      window.debugLog?.(
        `DEBUG: Player mounted - embedUrl: ${embedUrl}, playing: ${playing}, pipMode: ${pipMode}, draggable: ${draggable}`
      );

      return () => {
        window.debugLog?.("DEBUG: Player unmounted");
      };
    }, [embedUrl, playing, pipMode, draggable, trackTitle]);

    if (!embedUrl) {
      window.debugLog?.("DEBUG: Player embedUrl is empty");
      return null;
    }

    try {
      return (
        <ReactPlayer
          ref={ref}
          url={embedUrl}
          width="100%"
          height="300px"
          playing={playing}
          onEnded={onEnded}
          controls={true}
          volume={1}
          muted={false}
          playsinline={true}
          style={{ borderRadius: pipMode ? 8 : 0 }}
        />
      );
    } catch (e) {
      window.debugLog?.(`DEBUG: Player error: ${e}`);
      return null;
    }
  }
);

export default Player;
