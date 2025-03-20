import { defineConfig } from "vite"
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
      exclude: ["node_modules", "cypress", "*.cy.js", "coverage"],
      extension: [".js", ".jsx", ".ts", ".tsx"],
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    open: false,
    // no need to hot reload in CI
    hmr: process.env.CI ? false : true,
    watch: {
      ignored: ["node_modules", "cypress", "*.cy.js", "coverage"],
    },
  },
})
