/**
 * File: Home.jsx
 * Path: src/pages/Home/Home.jsx
 * Description: Home screen that loads trending videos and displays them in a list.
 */

import { useEffect, useState } from "react";
import { getTrending } from "../../api/trending";
import { debugLog } from "../../debug/debugBus";
import VideoCard from "../../components/VideoCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  bootDebug.info("Home.jsx mounted");

  useEffect(() => {
    async function load() {
      bootDebug.info("Fetching trending videos…");
      debugLog("API", "Fetching trending videos…");

      try {
        const data = await getTrending();
        setVideos(data.items || []);

        bootDebug.info("Trending videos loaded");
        debugLog("API", "Trending videos loaded", data);
      } catch (err) {
        bootDebug.error("Failed to load trending: " + err.message);
        debugLog("ERROR", "Failed to load trending", err);
      }
    }

    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Trending</h1>

      {videos.map((v) => (
        <VideoCard
          key={v.id}
          video={v}
          onClick={() => {
            bootDebug.info("Navigating to video " + v.id);
            navigate(`/watch/${v.id}`);
          }}
        />
      ))}
    </div>
  );
}
