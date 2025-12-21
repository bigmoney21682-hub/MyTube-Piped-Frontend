// File: src/components/Player.jsx

import { forwardRef } from "react";
import ReactPlayer from "react-player";

const Player = forwardRef(({ embedUrl, playing, muted }, ref) => {
  try {
    if (!embedUrl) {
      console.warn("Player: embedUrl is empty");
      return null;
    }

    return (
      <ReactPlayer
        ref={ref}
        url={embedUrl}
        width="100%"
        height="300px"
        playing={playing}
        controls={true}      // Allow iOS native controls
        volume={1}
        muted={muted}        // iOS autoplay-safe
        playsinline={true}   // iOS background playback
      />
    );
  } catch (e) {
    console.error("Player error:", e);
    return null;
  }
});

export default Player;
