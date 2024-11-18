import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import favicons from "@peterek/vite-plugin-favicons";

export default defineConfig({
  plugins: [react(), favicons("src/assets/Documentthing.png")],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
