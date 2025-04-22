import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8081,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add alias for problematic package
      "react-remove-scroll": path.resolve(__dirname, "node_modules/react-remove-scroll/dist/es5/index.js"),
    },
  },
  // Add cache control
  optimizeDeps: {
    force: true,
    include: [
      // Include problematic packages
      'react-remove-scroll',
      '@radix-ui/react-dialog',
    ],
  },
  // Clear cache on startup
  clearScreen: false,
  // Increase build performance
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    sourcemap: false,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
