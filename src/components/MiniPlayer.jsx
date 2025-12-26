// File: src/components/MiniPlayer.jsx
// MiniPlayer with full debug instrumentation + scroll awareness

import React, { useEffect, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { useNavigate } from "react-router-dom";
import { debugPlayer, debugLog } from "../utils/debug";

export default function MiniPlayer() {
  const { currentVideo } = usePlayer();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);

  // ------------------------------------------------------------
  // Mount / Unmount logging
  // ------------------------------------------------------------
  useEffect(() => {
    if (currentVideo?.id) {
      debugPlayer(`MiniPlayer mounted for id=${currentVideo.id}`);
      setVisible(true);
    } else {
      debugPlayer("MiniPlayer unmounted (no current video)");
      setVisible(false);
    }
  }, [currentVideo?.id]);

  // ------------------------------------------------------------
  // Scroll-triggered transition logging
  // ------------------------------------------------------------
  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;

      // When user scrolls down → MiniPlayer should appear
      if (scrollY > 120 && !visible) {
        debugPlayer("MiniPlayer → visible (scroll threshold passed)");
        setVisible(true);
      }

      // When user scrolls to top → MiniPlayer should hide
      if (scrollY < 40 && visible) {
        debugPlayer("MiniPlayer → hidden (near top)");
        setVisible(false);
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  // ------------------------------------------------------------
  // Expand → navigate to Watch
  // ------------------------------------------------------------
  const handleExpand = () => {
    if (!currentVideo?.id) return;

    debugPlayer(`MiniPlayer expand → /watch?v=${currentVideo.id}`);
    navigate(`/watch?v=${currentVideo.id}`);
  };

  if (!currentVideo?.id || !visible) return null;

  return (
    <div
      id="yt-mini-player"
      onClick={handleExpand}
      style={{
        position: "fixed",
        bottom: "var(--footer-height)",
        left: 0,
        right: 0,
        height: 64,
        background: "rgba(18,18,18,0.98)",
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        boxSizing: "border-box",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        zIndex: 99980, // below GlobalPlayer (99990), below DebugOverlay (99999)
        cursor: "pointer",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: 96,
          height: 54,
          background: "#000",
          borderRadius: 8,
          overflow: "hidden",
          marginRight: 12,
          flexShrink: 0,
        }}
      >
        {currentVideo.thumbnail && (
          <img
            src={currentVideo.thumbnail}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentVideo.title || "Playing…"}
        </div>
        <div
          style={{
            color: "#aaa",
            fontSize: 12,
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentVideo.channelTitle || currentVideo.channel || ""}
        </div>
      </div>
    </div>
  );
}
