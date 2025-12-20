// File: src/components/BootSplash.jsx
import { useEffect, useState } from "react";

const text = "MyTube";

export default function BootSplash({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [flicker, setFlicker] = useState(1);

  // Typing animation
  useEffect(() => {
    if (index < text.length) {
      const t = setTimeout(() => setIndex(i => i + 1), 450); // slower typing
      return () => clearTimeout(t);
    } else {
      // Animation complete, signal parent
      if (onFinish) setTimeout(() => onFinish(), 500); // slight pause
    }
  }, [index]);

  // Flame top flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(0.8 + Math.random() * 0.4); // flicker top only
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 100,
            display: "inline-block",
            transformOrigin: "top",
            transform: `scaleY(${flicker})`,
            transition: "transform 0.1s",
          }}
        >
          🔥
        </div>
        <div style={{ fontSize: 48, color: "#fff", letterSpacing: 3, marginTop: 12 }}>
          {text.slice(0, index)}
        </div>
      </div>
    </div>
  );
}
