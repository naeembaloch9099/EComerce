import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 allows access from LAN
    port: 5173, // optional (default 5173)
  },
});
