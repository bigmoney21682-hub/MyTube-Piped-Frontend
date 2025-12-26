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

  useEffect(() => {
    async function load() {
      debugLog("UI", "Loading trending videos…");
      const data = await getTrending();
      setVideos(data.items || []);
      debugLog("UI", "Trending videos loaded", data);
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
          onClick={() => navigate(`/watch/${v.id}`)}
        />
      ))}
    </div>
  );
}
