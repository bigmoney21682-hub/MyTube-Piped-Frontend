import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RelatedVideos from "../components/RelatedVideos";
import Spinner from "../components/Spinner";
import Header from "../components/Header"; // ✅ added
import Footer from "../components/Footer"; // ✅ added
import { API_KEY } from "../config";

export default function Watch() {
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

  if (loading)
    return (
      <div
        style={{
          paddingTop: "var(--header-height)",
          paddingBottom: "var(--footer-height)",
          minHeight: "100vh",
          background: "var(--app-bg)",
          color: "#fff",
        }}
      >
        <Header />
        <Spinner message="Loading video…" />
        <Footer />
      </div>
    );

  if (!video) {
    return (
      <div
        style={{
          paddingTop: "var(--header-height)",
          paddingBottom: "var(--footer-height)",
          minHeight: "100vh",
          background: "var(--app-bg)",
          color: "#fff",
        }}
      >
        <Header />
        <div style={{ padding: 16 }}>
          <p>Video not found or unavailable.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { snippet } = video;

  return (
    <div
      style={{
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--footer-height)",
        minHeight: "100vh",
        background: "var(--app-bg)",
        color: "#fff",
      }}
    >
      <Header />

      <h2>{snippet.title}</h2>
      <p style={{ opacity: 0.7 }}>by {snippet.channelTitle}</p>

      {/* Embedded YouTube player */}
      <iframe
        title={snippet.title}
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${id}?controls=1`}
        allow="encrypted-media"
        allowFullScreen
        style={{ border: "none", marginTop: 16 }}
      />

      {/* Related videos */}
      <div style={{ marginTop: 32 }}>
        <h3>Related Videos</h3>
        <RelatedVideos videoId={id} apiKey={API_KEY} />
      </div>

      <Footer />
    </div>
  );
}
