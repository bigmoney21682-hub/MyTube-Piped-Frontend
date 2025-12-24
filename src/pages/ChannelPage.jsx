// File: src/pages/ChannelPage.jsx
// PCC v1.0 — Safe, minimal channel page with debug logging + back navigation

import { useLocation, useNavigate, useParams } from "react-router-dom";
import DebugOverlay from "../components/DebugOverlay";

export default function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const log = (msg) => window.debugLog?.(`ChannelPage: ${msg}`);

  // Data passed from Watch.jsx
  const channelTitle = location.state?.channelTitle || "Unknown Channel";
  const channelThumb = location.state?.channelThumb || null;

  log(`render — id=${id}, title=${channelTitle}`);

  return (
    <>
      <DebugOverlay pageName="Channel" />

      <div style={{ padding: 16, color: "#fff" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "6px 12px",
            background: "#222",
            border: "1px solid #444",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          ← Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {channelThumb && (
            <img
              src={channelThumb}
              alt={channelTitle}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}

          <h1 style={{ margin: 0 }}>{channelTitle}</h1>
        </div>

        <p style={{ marginTop: 24, opacity: 0.7 }}>
          Channel page placeholder — no API calls yet.
        </p>
      </div>
    </>
  );
}
