import { defineConfig } from "cypress"
// https://github.com/bahmutov/cypress-code-coverage
import codeCoverage from "@bahmutov/cypress-code-coverage/plugin"

export default defineConfig({
  defaultBrowser: "electron",
  e2e: {
    // baseUrl, etc
    baseUrl: "http://localhost:5173/",
    viewportHeight: 1000,
    setupNodeEvents(on, config) {
      codeCoverage(on, config)

      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    },
  },
})
