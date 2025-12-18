// src/components/Spinner.jsx

export default function Spinner({ message = "Loading…" }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        gap: 24,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          border: "8px solid rgba(255,255,255,0.2)",
          borderTop: "8px solid #ff4500",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          background: "conic-gradient(from 0deg, #ff8c00, #ff4500, #ff0000)",
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <p style={{ color: "#fff", fontSize: "1.2rem", opacity: 0.9 }}>
        {message}
      </p>
    </div>
  );
}
