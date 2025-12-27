/**
 * File: App.jsx
 * Path: src/app/App.jsx
 * Description: App shell with BrowserRouter, Home, Watch, ErrorBoundary,
 *              DebugOverlay, and full router diagnostic logging.
 */

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";

import DebugOverlay from "../debug/DebugOverlay";
import Home from "../pages/Home/Home";
import Watch from "../pages/Watch/Watch";

// ------------------------------------------------------------
// Router Diagnostic Logger Component
// ------------------------------------------------------------
function RouterLogger() {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    const path = location.pathname + location.search + location.hash;

    window.bootDebug?.router?.(
      `ROUTER EVENT → ${path} | navType=${navType} | ts=${Date.now()}`
    );
  }, [location, navType]);

  return null;
}

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
        <RouterLogger />

        <AppErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AppErrorBoundary>
      </BrowserRouter>

      <DebugOverlay />
    </>
  );
}
