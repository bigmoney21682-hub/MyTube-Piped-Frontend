/**
 * File: DebugConsole.jsx
 * Path: src/debug/DebugConsole.jsx
 * Description: Console inspector for DebugOverlay v3. Displays all non-network logs.
 */

export default function DebugConsole({ logs, colors, formatTime }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        overflowX: "hidden",
        overflowY: "auto",
        width: "100%",
        boxSizing: "border-box",
        whiteSpace: "normal",
        wordBreak: "break-word",
        minWidth: 0
      }}
    >
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            color: colors[log.level] || "#0f0",
            fontSize: 12,
            lineHeight: "16px"
          }}
        >
          <span style={{ opacity: 0.6 }}>
            {formatTime(log.ts)}{" "}
          </span>
          [{log.level}] {log.msg}
        </div>
      ))}
    </div>
  );
}
