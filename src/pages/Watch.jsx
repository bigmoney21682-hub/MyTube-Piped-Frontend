// File: src/pages/Watch.jsx
// PCC v2.2 — Uses PlayerContext, clean layout, related videos fix

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RelatedVideos from "../components/RelatedVideos";
import Spinner from "../components/Spinner";
import Player from "../components/Player";
import DebugOverlay from "../components/DebugOverlay";
import { API_KEY } from "../config";
import { usePlayer } from "../contexts/PlayerContext";

export default function Watch() {
  const { id } = useParams();
  const {
    currentVideo,
    playing,
    playVideo,
    setCurrentVideo,
    setPlaying,
    setPlaylist,
    setCurrentIndex,
  } = usePlayer();

  const [video, setVideo] = useState(currentVideo || null);
  const [loading, setLoading] = useState(!currentVideo);
  const [playlist, setLocalPlaylist] = useState([]);
  const [currentIndex, setLocalIndex] = useState(0);
  const playerRef = useRef(null);

  const log = (msg) => window.debugLog?.(`Watch(${id}): ${msg}`);

  useEffect(() => {
    if (!id) return;

    if (
      currentVideo &&
      (currentVideo.id === id || currentVideo.id?.videoId === id)
    ) {
      log("Using existing currentVideo from global state");
      setVideo(currentVideo);
      setLoading(false);
      return;
    }

    setLoading(true);
    log(`Fetching video metadata for id: ${id}`);

    (async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${API_KEY}`
        );
        const data = await res.json();

        if (data.items?.length > 0) {
          const fetchedVideo = data.items[0];
          setVideo(fetchedVideo);
          playVideo(fetchedVideo); // sync to global
          log("Video fetched and global currentVideo updated");
        } else {
          setVideo(null);
          log("No video returned from API");
        }
      } catch (err) {
        log(`Video fetch error: ${err}`);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, currentVideo, playVideo]);

  useEffect(() => {
    if (video) {
      setLocalPlaylist([video]);
      setLocalIndex(0);
      setPlaylist([video]);
      setCurrentIndex(0);
      log("Playlist set to single current video");
    }
  }, [video, setPlaylist, setCurrentIndex]);

  const handleEnded = () => {
    log("Video ended");
    setPlaying(false);
    // future: use playNext() from context
  };

  const currentTrack = playlist[currentIndex] || video;
  const snippet = currentTrack?.snippet || {};

  // Normalized videoId
  let videoIdForApi = "";
  if (typeof currentTrack?.id === "string") {
    videoIdForApi = currentTrack.id;
  } else if (currentTrack?.id?.videoId) {
    videoIdForApi = currentTrack.id.videoId;
  }
  videoIdForApi = String(videoIdForApi || "").trim();

  const embedUrl = videoIdForApi
    ? `https://www.youtube-nocookie.com/embed/${videoIdForApi}`
    : "";

  const handleSeekRelative = (secs) => {
    const player = playerRef.current;
    if (!player) return;
    try {
      const current = player.getCurrentTime?.() || 0;
      player.seekTo(current + secs, "seconds");
      log(`Seeked ${secs} seconds (${current} -> ${current + secs})`);
    } catch (e) {
      log(`Seek error: ${e}`);
    }
  };

  const handlePrev = () => {
    log("Prev video requested (no previous in single-item playlist)");
  };

  const handleNext = () => {
    log("Next video requested (no next in single-item playlist)");
  };

  return (
    <div
      style={{
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--footer-height)",
        background: "var(--app-bg)",
        color: "#fff",
      }}
    >
      <DebugOverlay pageName="Watch" />

      {loading && <Spinner message="Loading video…" />}

      {!loading && !currentTrack && (
        <div style={{ padding: 16 }}>
          <p>Video not found or unavailable.</p>
        </div>
      )}

      {!loading && currentTrack && (
        <>
          {/* Player container: full width, 16:9 from viewport width */}
          {embedUrl && (
            <div
              style={{
                width: "100%",
                background: "#000",
                position: "relative",
                height: "calc((100vw) * 9 / 16)",
                overflow: "hidden",
              }}
            >
              <Player
                ref={playerRef}
                embedUrl={embedUrl}
                playing={playing}
                onEnded={handleEnded}
                pipMode={false}
                draggable={false}
                trackTitle={snippet.title}
                onSeekRelative={handleSeekRelative}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
          )}

          {/* Title/description BELOW player */}
          <div style={{ padding: "12px 16px 8px 16px" }}>
            <h2 style={{ margin: 0 }}>{snippet.title}</h2>
            <p style={{ margin: "4px 0 0 0", opacity: 0.7 }}>
              by {snippet.channelTitle}
            </p>
          </div>

          {/* Related videos BELOW description */}
          {videoIdForApi.length > 0 && (
            <RelatedVideos
              videoId={videoIdForApi}
              apiKey={API_KEY}
              onDebugLog={log}
            />
          )}
        </>
      )}
    </div>
  );
}
