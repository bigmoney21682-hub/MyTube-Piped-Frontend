// File: src/pages/Watch.jsx

import { useParams } from "react-router-dom";
import RelatedVideos from "../components/RelatedVideos";
import Spinner from "../components/Spinner";
import { API_KEY } from "../config"; // ✅ Use the env-configured key

export default function Watch({ apiKey }) {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${API_KEY}`
        );
        const data = await res.json();
        if (data.items?.length > 0) {
          setVideo(data.items[0]);
        } else {
          setVideo(null);
        }
      } catch (err) {
        console.error("Video fetch error:", err);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Spinner message="Loading video…" />;

  if (!video) {
    return (
      <div style={{ padding: 16, color: "#fff" }}>
        <p>Video not found or unavailable.</p>
      </div>
    );
  }

  const { snippet } = video;

  return (
    <div style={{ padding: 16 }}>
      <h2>{snippet.title}</h2>
      <p style={{ opacity: 0.7 }}>by {snippet.channelTitle}</p>

      {/* Embedded YouTube player */}
      <iframe
        title={snippet.title}
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${id}?autoplay=1&controls=1`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ border: "none", marginTop: 16 }}
      ></iframe>

      {/* Related videos */}
      <div style={{ marginTop: 32 }}>
        <h3>Related Videos</h3>
        <RelatedVideos videoId={id} apiKey={API_KEY} />
      </div>
    </div>
  );
}
