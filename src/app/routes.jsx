/**
 * File: routes.jsx
 * Path: src/app/routes.jsx
 * Description: Central routing table with router event logging.
 */

import { Routes as Switch, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Watch from "../pages/Watch/Watch";
import { useEffect } from "react";
import { logRouter } from "../debug/debugBus";

function RouterEvents() {
  const location = useLocation();

  useEffect(() => {
    logRouter("Route changed", { path: location.pathname });
    bootDebug.info("ROUTER → " + location.pathname);
  }, [location]);

  return null;
}

export default function Routes() {
  return (
    <>
      <RouterEvents />
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Switch>
    </>
  );
}
