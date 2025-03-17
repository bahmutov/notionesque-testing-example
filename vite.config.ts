import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
// https://github.com/iFaxity/vite-plugin-istanbul
import IstanbulPlugin from "vite-plugin-istanbul"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    IstanbulPlugin({
      include: "src/*",
      exclude: ["node_modules", "cypress/", "*.cy.js"],
      extension: [".js", ".jsx", ".ts", ".tsx"],
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    open: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
