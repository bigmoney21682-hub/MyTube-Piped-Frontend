/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: Full App shell with BrowserRouter, Home, Watch, ErrorBoundary,
 *              and global DebugOverlay. No ReactPlayer anywhere.
 */

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DebugOverlay from "../debug/DebugOverlay";
import Home from "../pages/Home/Home";
import Watch from "../pages/Watch/Watch";

// ------------------------------------------------------------
// Error Boundary
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Main App Component
// ------------------------------------------------------------
export default function App() {
  useEffect(() => {
    window.bootDebug?.boot("App.jsx mounted — Router active");
  }, []);

  return (
    <>
      <BrowserRouter>
        <AppErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
          </Routes>
        </AppErrorBoundary>
      </BrowserRouter>

      <DebugOverlay />
    </>
  );
}
