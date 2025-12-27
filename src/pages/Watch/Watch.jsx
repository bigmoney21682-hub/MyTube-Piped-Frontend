/**
 * File: Watch.jsx
 * Path: src/pages/Watch/Watch.jsx
 * Description: Video watch page using YouTube IFrame API + DebugOverlay logging.
 */
window.bootDebug?.boot("Watch.jsx file loaded");

import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getVideoDetails } from "../../api/youtube";

export default function Watch() {
  const { id } = useParams();
  const playerRef = useRef(null);
  const iframeRef = useRef(null);

  const [details, setDetails] = useState(null);

  /* -------------------------------------------------------
     LOAD METADATA
  ------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    window.bootDebug?.watch("Watch.jsx mounted with id:", id);
    window.bootDebug?.api("Watch.jsx → Fetching video details…");

    getVideoDetails(id).then((info) => {
      setDetails(info);
      window.bootDebug?.api("Watch.jsx → Metadata loaded:", info);
    });
  }, [id]);

  /* -------------------------------------------------------
     LOAD YOUTUBE IFRAME API
  ------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    window.bootDebug?.player("Watch.jsx → Loading YouTube IFrame API");

    // If API already loaded, initialize immediately
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    // Otherwise inject script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      window.bootDebug?.player("YouTube IFrame API ready");
      createPlayer();
    };
  }, [id]);

  /* -------------------------------------------------------
     CREATE PLAYER
  ------------------------------------------------------- */
  function createPlayer() {
    if (!iframeRef.current) return;

    window.bootDebug?.player("Watch.jsx → Creating player instance");

    playerRef.current = new window.YT.Player(iframeRef.current, {
      videoId: id,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: () => {
          window.bootDebug?.player("IFrame → ready");
        },
        onStateChange: (e) => {
          const stateMap = {
            "-1": "unstarted",
            "0": "ended",
            "1": "playing",
            "2": "paused",
            "3": "buffering",
            "5": "cued"
          };
          window.bootDebug?.player("IFrame → " + stateMap[e.data]);
        },
        onError: (e) => {
          window.bootDebug?.error("IFrame error:", e.data);
        }
      }
    });
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "40px"
      }}
    >
      {/* Player */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          aspectRatio: "16 / 9",
          background: "#000",
          overflow: "hidden",
          position: "relative",
          marginTop: "20px"
        }}
      >
        <div
          ref={iframeRef}
          id="yt-player"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Metadata */}
      {details && (
        <div style={{ width: "100%", maxWidth: "900px", marginTop: "20px" }}>
          <h2 style={{ margin: 0 }}>{details.title}</h2>

          <div style={{ opacity: 0.7, marginTop: 4 }}>
            {details.channel} • {Number(details.views).toLocaleString()} views
          </div>

          <p style={{ marginTop: "16px", lineHeight: 1.5, opacity: 0.9 }}>
            {details.description}
          </p>
        </div>
      )}
    </div>
  );
}
