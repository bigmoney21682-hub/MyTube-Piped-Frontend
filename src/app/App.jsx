/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Minimal App shell that renders Home directly (router bypassed for debugging).
 */

import React, { useEffect } from "react";
import DebugOverlay from "../debug/DebugOverlay";

// Directly import Home, ignore Watch/router for now
import Home from "../pages/Home/Home";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    try {
      window.bootDebug?.error("AppErrorBoundary → " + error.message);
      window.bootDebug?.error("AppErrorBoundary stack → " + info.componentStack);
    } catch (_) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "16px", color: "white" }}>
          <h1>Something went wrong.</h1>
          <p>Check DebugOverlay for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    window.bootDebug?.boot("App.jsx mounted — NO ROUTER, rendering <Home /> directly");
  }, []);

  return (
    <>
      <AppErrorBoundary>
        <Home />
      </AppErrorBoundary>

      <DebugOverlay />
    </>
  );
}
