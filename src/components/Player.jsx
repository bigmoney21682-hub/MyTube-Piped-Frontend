// File: src/components/Player.jsx

import ReactPlayer from "react-player";

export default function Player({ src, onEnded }) {
  return (
    <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
      <ReactPlayer
        url={src}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
        controls
        playing
        autoPlay
        playsinline
        onEnded={onEnded}
      />
    </div>
  );
}
