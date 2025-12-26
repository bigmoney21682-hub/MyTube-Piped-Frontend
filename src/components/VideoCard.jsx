/**
 * File: VideoCard.jsx
 * Path: src/components/VideoCard.jsx
 * Description: Displays a single video thumbnail, title, and channel. Clickable.
 */

export default function VideoCard({ video, onClick }) {
  const snippet = video.snippet;

  return (
    <div
      onClick={onClick}
      style={{
        marginBottom: 20,
        cursor: "pointer",
        display: "flex",
        gap: 12,
        alignItems: "flex-start"
      }}
    >
      <img
        src={snippet.thumbnails.medium.url}
        alt={snippet.title}
        style={{ width: 200, borderRadius: 8 }}
      />

      <div>
        <h3 style={{ margin: 0 }}>{snippet.title}</h3>
        <p style={{ margin: 0, color: "#666" }}>{snippet.channelTitle}</p>
      </div>
    </div>
  );
}
