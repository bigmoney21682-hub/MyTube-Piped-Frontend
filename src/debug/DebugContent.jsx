/**
 * File: DebugContent.jsx
 * Path: src/debug/DebugContent.jsx
 */

import React from "react";

import DebugPlayer from "./DebugPlayer.jsx";
import DebugRouter from "./DebugRouter.jsx";
import DebugNetwork from "./DebugNetwork.jsx";
import DebugPerf from "./DebugPerf.jsx";
import DebugCommandBar from "./DebugCommandBar.jsx";

const COLORS = {
  BOOT: "#0f0",
  PLAYER: "#4af",
  ROUTER: "#fa4",
  NETWORK: "#af4",
  PERF: "#f4a",
  CMD: "#ff4"
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString();
}

export default function DebugContent({ activeChannel, logs }) {
  const channelLogs = logs[activeChannel];

  switch (activeChannel) {
    case "PLAYER":
      return (
        <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
          <DebugPlayer logs={channelLogs} colors={COLORS} formatTime={formatTime} />
        </div>
      );

    case "ROUTER":
      return (
        <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
          <DebugRouter logs={channelLogs} colors={COLORS} formatTime={formatTime} />
        </div>
      );

    case "NETWORK":
      return (
        <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
          <DebugNetwork logs={channelLogs} colors={COLORS} formatTime={formatTime} />
        </div>
      );

    case "PERF":
      return (
        <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
          <DebugPerf logs={channelLogs} colors={COLORS} formatTime={formatTime} />
        </div>
      );

    case "CMD":
      return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
            {channelLogs.map((l, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ opacity: 0.6 }}>{formatTime(l.ts)}</div>
                <div>{l.msg}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #333", padding: 6 }}>
            <DebugCommandBar
              onCommand={(entry) => {
                debugBus.cmd(entry.msg, entry);
              }}
            />
          </div>
        </div>
      );

    case "BOOT":
    default:
      return (
        <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
          {channelLogs.map((l, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ opacity: 0.6 }}>{formatTime(l.ts)}</div>
              <div>{l.msg}</div>
            </div>
          ))}
        </div>
      );
  }
}
