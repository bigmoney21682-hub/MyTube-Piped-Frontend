import { forwardRef } from "react";
import ReactPlayer from "react-player";

const Player = forwardRef(({ embedUrl, playing, onEnded, pipMode, draggable, trackTitle }, ref) => {
  try {
    if (!embedUrl) {
      console.warn("Player: embedUrl is empty");
      return null;
    }

    return (
      <ReactPlayer
        ref={ref}
        url={embedUrl}
        width="100%"       // Force visible width
        height="300px"     // Force visible height for iOS mount
        playing={playing}
        onEnded={onEnded}
        controls={false}
        volume={1}
        muted={false}
        playsinline={true} // iOS background playback
        style={{ borderRadius: pipMode ? 8 : 0 }}
      />
    );
  } catch (e) {
    console.error("Player error:", e);
    return null;
  }
});

export default Player;
