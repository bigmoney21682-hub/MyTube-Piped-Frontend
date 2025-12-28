/**
 * File: Watch.jsx
 * Path: src/pages/Watch/Watch.jsx
 * Description: Watch page using YouTube IFrame Player API + YouTube Data API v3.
 */

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVideoDetails } from "../../api/video.js";
import { debugBus } from "../../debug/debugBus.js";

export default function Watch() {
  const { id } = useParams();
  const playerRef = useRef(null);
  const iframeRef = useRef(null);

  const [video, setVideo] = useState(null);

  // ------------------------------------------------------------
  // Load video details
  // ------------------------------------------------------------
  useEffect(() => {
    window.bootDebug.watch("Watch mounted → id=" + id);

    async function load() {
      const details = await fetchVideoDetails(id);
      setVideo(details);
    }

    load();
  }, [id]);

  // ------------------------------------------------------------
  // Load YouTube IFrame API script
  // ------------------------------------------------------------
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.bootDebug.player("Injected YouTube IFrame API script");
    }

    window.onYouTubeIframeAPIReady = () => {
      window.bootDebug.player("IFrame API Ready → Creating player");

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: id,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (e) => {
            debugBus.player("Player ready");
          },
          onStateChange: (e) => {
            const state = e.data;
            const map = {
              "-1": "unstarted",
              "0": "ended",
              "1": "playing",
              "2": "paused",
              "3": "buffering",
              "5": "cued"
            };
            debugBus.player("State → " + map[state]);
          }
        }
      });
    };
  }, [id]);

  if (!video) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        Loading video…
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.playerWrapper}>
        <div id="yt-player" ref={iframeRef} style={styles.player}></div>
      </div>

      <div style={styles.info}>
        <h2>{video.title}</h2>
        <div style={styles.meta}>
          <span>{video.author}</span>
          <span>{Number(video.views).toLocaleString()} views</span>
        </div>
        <p style={styles.desc}>{video.description}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "16px",
    color: "white"
  },
  playerWrapper: {
    width: "100%",
    maxWidth: "960px",
    margin: "0 auto"
  },
  player: {
    width: "100%",
    height: "540px",
    background: "black",
    borderRadius: "8px"
  },
  info: {
    marginTop: "20px",
    maxWidth: "960px",
    margin: "20px auto"
  },
  meta: {
    opacity: 0.7,
    marginBottom: "10px"
  },
  desc: {
    opacity: 0.8,
    whiteSpace: "pre-wrap"
  }
};
