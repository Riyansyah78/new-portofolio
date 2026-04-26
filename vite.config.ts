import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 3D engine — heavy, lazy loaded via dynamic import
          if (
            id.includes("three") ||
            id.includes("@react-three/fiber") ||
            id.includes("@react-three/drei") ||
            id.includes("meshline")
          ) {
            return "vendor-three";
          }
          // Physics engine — heavy, lazy loaded
          if (id.includes("@react-three/rapier") || id.includes("@dimforge")) {
            return "vendor-physics";
          }
          // Animation library
          if (id.includes("framer-motion")) {
            return "vendor-framer";
          }
          // Router
          if (id.includes("@tanstack")) {
            return "vendor-router";
          }
          // Radix UI components
          if (id.includes("@radix-ui")) {
            return "vendor-radix";
          }
        },
      },
    },
  },
});
