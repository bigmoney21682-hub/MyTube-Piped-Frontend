// File: src/components/BootSplash.jsx
import { useEffect, useState } from "react";

export default function BootSplash({ onFinish }) {
  const [displayText, setDisplayText] = useState("");

  const fullText = "MyTube";

  useEffect(() => {
    let i = 0;

    function typeNext() {
      if (i < fullText.length) {
        setDisplayText((prev) => prev + fullText[i]);
        i++;
        setTimeout(typeNext, 250); // 250ms per letter
      } else {
        // Finish splash after short pause
        setTimeout(() => {
          if (typeof onFinish === "function") onFinish();
        }, 500); // half-second hold
      }
    }

    typeNext();
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 64, color: "#ff4500" }}>🔥</div>
      <div style={{ fontSize: 48, color: "#fff", marginTop: 16 }}>
        {displayText}
      </div>
    </div>
  );
}
