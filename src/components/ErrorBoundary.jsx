// File: src/components/ErrorBoundary.jsx
// PCC v3.0 — Auto-recover, persistent crash logging, DebugOverlay-safe

import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { crashed: true, error };
  }

  componentDidCatch(error, info) {
    const entry = {
      type: "ReactRenderCrash",
      message: error?.toString(),
      extra: info?.componentStack || "",
      time: new Date().toISOString(),
    };

    // Persist to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("fatal_errors") || "[]");
      existing.push(entry);
      localStorage.setItem("fatal_errors", JSON.stringify(existing));
    } catch {}

    // Also store in memory for DebugOverlay
    window.__fatalErrors = window.__fatalErrors || [];
    window.__fatalErrors.push(entry);

    // Auto-recover after a short delay
    setTimeout(() => {
      window.location.hash = "#/"; // HashRouter safe
      window.location.reload();
    }, 400);
  }

  render() {
    if (this.state.crashed) {
      // Keep DebugOverlay visible by rendering children anyway
      return (
        <div style={{ padding: 20, color: "#fff", background: "#000" }}>
          <h2>Recovering from crash…</h2>
          <p>{this.state.error?.toString()}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
