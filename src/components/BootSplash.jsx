// File: src/components/BootSplash.jsx
import { useEffect, useState } from "react";

export default function BootSplash({ onFinish }) {
  const [progress, setProgress] = useState(0); // 0 → 100% letters revealed

  useEffect(() => {
    const letters = "MyTube";
    let i = 0;

    // Full duration = 2s
    const interval = setInterval(() => {
      i++;
      setProgress(i);
      if (i >= letters.length) {
        clearInterval(interval);
        // Wait an extra 0.5s for flame flicker
        setTimeout(() => onFinish?.(), 500);
      }
    }, 300); // 0.3s per letter → 2.1s total
  }, [onFinish]);

  const letters = "MyTube".split("");
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: "bold", color: "#ff4500" }}>
        🔥
      </div>
      <div style={{ fontSize: 48, color: "#fff", marginTop: 16 }}>
        {letters.map((l, idx) =>
          idx < progress ? (
            <span key={idx} style={{ opacity: 1, transition: "opacity 0.3s" }}>
              {l}
            </span>
          ) : (
            <span key={idx} style={{ opacity: 0 }}>
              {l}
            </span>
          )
        )}
      </div>
    </div>
  );
}
