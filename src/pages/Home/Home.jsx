/**
 * File: Home.jsx
 * Path: src/pages/Home/Home.jsx
 * Description: Home page showing trending videos (most popular) with
 *              stacked 16:9 thumbnails and minimal quota usage.
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { debugBus } from "../../debug/debugBus.js";
import { getApiKey } from "../../api/getApiKey.js";

const API_KEY = getApiKey();

const cardStyle = {
  width: "100%",
  marginBottom: "20px",
  textDecoration: "none",
  color: "#fff",
  display: "block"
};

const thumbStyle = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "8px"
};

const titleStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "4px"
};

const channelStyle = {
  fontSize: "13px",
  opacity: 0.7,
  marginBottom: "6px"
};

const descStyle = {
  fontSize: "13px",
  opacity: 0.8,
  lineHeight: 1.4
};

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchTrending();
  }, []);

  async function fetchTrending() {
    try {
      const url =
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=snippet,statistics&chart=mostPopular&maxResults=5&regionCode=US&key=${API_KEY}`;

      debugBus.player("Home.jsx → fetchTrending: " + url);

      const res = await fetch(url);
      const data = await res.json();

      const items = Array.isArray(data?.items) ? data.items : [];
      setVideos(items);

      if (!items.length) {
        debugBus.player("Home.jsx → fetchTrending returned 0 items");
      }
    } catch (err) {
      debugBus.player("Home.jsx → fetchTrending error: " + (err?.message || err));
      setVideos([]);
    }
  }

  return (
    <div style={{ padding: "16px", color: "#fff" }}>
      <h2 style={{ marginBottom: "12px" }}>Trending</h2>

      {videos.map((item, i) => {
        const vid = item?.id;
        const sn = item?.snippet ?? {};
        const thumb = sn?.thumbnails?.medium?.url ?? "";

        if (!vid) return null;

        return (
          <Link
            key={vid + "_" + i}
            to={`/watch/${vid}`}
            style={cardStyle}
          >
            <img
              src={thumb}
              alt={sn.title ?? "Video thumbnail"}
              style={thumbStyle}
            />

            <div style={titleStyle}>{sn.title ?? "Untitled"}</div>
            <div style={channelStyle}>{sn.channelTitle ?? "Unknown Channel"}</div>
            <div style={descStyle}>{sn.description ?? ""}</div>
          </Link>
        );
      })}
    </div>
  );
}
