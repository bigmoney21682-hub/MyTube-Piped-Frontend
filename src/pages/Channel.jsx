/**
 * File: Channel.jsx
 * Path: src/pages/Channel.jsx
 * Description: Channel page showing channel details + channel videos.
 *              Fully wired to PlayerContext + GlobalPlayer.
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayer } from "../player/PlayerContext.jsx";
import { debugBus } from "../debug/debugBus.js";

const API_KEY = import.meta.env.VITE_YT_API_KEY;

export default function Channel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadVideo, queueAdd } = usePlayer();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  // ------------------------------------------------------------
  // Fetch channel info + channel videos
  // ------------------------------------------------------------
  useEffect(() => {
    if (!id) return;

    debugBus.player("Channel.jsx → Loading channel " + id);

    fetchChannelDetails(id);
    fetchChannelVideos(id);
  }, [id]);

  // ------------------------------------------------------------
  // Fetch channel details
  // ------------------------------------------------------------
  async function fetchChannelDetails(channelId) {
    try {
      const url =
        `https://www.googleapis.com/youtube/v3/channels?` +
        `part=snippet,statistics&id=${channelId}&key=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setChannel(data.items[0]);
      }
    } catch (err) {
      debugBus.player("Channel.jsx → fetchChannelDetails error: " + err?.message);
    }
  }

  // ------------------------------------------------------------
  // Fetch channel videos
  // ------------------------------------------------------------
  async function fetchChannelVideos(channelId) {
    try {
      const url =
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&type=video&maxResults=30&channelId=${channelId}&key=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.items) {
        setVideos(data.items);
      }
    } catch (err) {
      debugBus.player("Channel.jsx → fetchChannelVideos error: " + err?.message);
    }
  }

  // ------------------------------------------------------------
  // Open video
  // ------------------------------------------------------------
  function openVideo(videoId) {
    debugBus.player("Channel.jsx → Navigate to /watch/" + videoId);
    navigate(`/watch/${videoId}`);
    loadVideo(videoId);
  }

  if (!channel) {
    return (
      <div style={{ padding: "16px", color: "#fff" }}>
        Loading channel…
      </div>
    );
  }

  const sn = channel.snippet;

  return (
    <div style={{ paddingBottom: "80px", color: "#fff" }}>
      {/* Channel header */}
      <div style={{ padding: "16px", textAlign: "center" }}>
        <img
          src={sn.thumbnails.high.url}
          alt=""
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "60px",
            marginBottom: "12px"
          }}
        />
        <h2>{sn.title}</h2>
        <div style={{ opacity: 0.7, marginTop: "4px" }}>
          {channel.statistics.subscriberCount} subscribers
        </div>
      </div>

      {/* Channel videos */}
      <div style={{ padding: "16px" }}>
        <h3>Videos</h3>

        {videos.map((item) => {
          const vid = item.id.videoId;
          const sn = item.snippet;

          return (
            <div
              key={vid}
              style={{
                display: "flex",
                marginBottom: "16px",
                cursor: "pointer"
              }}
            >
              <img
                src={sn.thumbnails.medium.url}
                alt=""
                onClick={() => openVideo(vid)}
                style={{
                  width: "168px",
                  height: "94px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "12px"
                }}
              />

              <div style={{ flex: 1 }}>
                <div
                  onClick={() => openVideo(vid)}
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    marginBottom: "4px"
                  }}
                >
                  {sn.title}
                </div>

                <div style={{ fontSize: "13px", opacity: 0.7 }}>
                  {sn.channelTitle}
                </div>

                <button
                  onClick={() => queueAdd(vid)}
                  style={{
                    marginTop: "8px",
                    padding: "6px 10px",
                    background: "#222",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "4px"
                  }}
                >
                  + Queue
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
