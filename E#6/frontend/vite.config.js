import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const tourDefault = "http://localhost:8080";
const guideDefault = "http://localhost:8081";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api/tours": {
        target: process.env.VITE_TOUR_API_BASE ?? tourDefault,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tours/, "/tours"),
      },
      "/api/guides": {
        target: process.env.VITE_GUIDE_API_BASE ?? guideDefault,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/guides/, "/guides"),
      },
    },
  },
});
