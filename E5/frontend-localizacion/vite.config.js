import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      "/fiestas": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
});
