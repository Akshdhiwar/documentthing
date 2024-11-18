import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import favicons from "@peterek/vite-plugin-favicons";

const imagePath = path.resolve(__dirname, "src/assets/Documentthing.png");
console.log("Resolved image path:", imagePath); // Log the resolved path

export default defineConfig({
  plugins: [
    react(),
    favicons(imagePath),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
