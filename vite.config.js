import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist/ai-flow",
    emptyOutDir: false,
    rollupOptions: {
      input: "components/ai-flow-entry.jsx",
      output: {
        entryFileNames: "ai-flow.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "ai-flow.css";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
