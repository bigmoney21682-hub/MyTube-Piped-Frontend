/**
 * ------------------------------------------------------------
 * File: vite.config.js
 * Path: vite.config.js
 * Description:
 *   Vite configuration for GitHub Pages deployment under /MyTubes/.
 *   - base MUST match the repo name exactly
 *   - React plugin enabled
 *   - No extra config needed
 * ------------------------------------------------------------
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ⭐ REQUIRED for GitHub Pages
  // Your site is served at:
  // https://bigmoney21682-hub.github.io/MyTubes/
  base: "/MyTubes/"
});
