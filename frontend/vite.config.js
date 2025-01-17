import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        "/bootstrap/dist/css/bootstrap.min.css",
        "/react-bootstrap/Button",
      ],
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000", // Adjust the port to your backend's port
    },
  },
  resolve: {
    alias: {
      "react-bootstrap": resolve(__dirname, "../node_modules/react-bootstrap"),
      react: path.resolve(__dirname, "../node_modules/react"),
      "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
    },
    preserveSymlinks: true,
  },
  cacheDir: path.resolve(__dirname, "../.vite-cache"), // Set cache directory outside frontend
});
