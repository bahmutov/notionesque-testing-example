import { defineConfig } from "cypress"
// https://github.com/bahmutov/cypress-code-coverage
import codeCoverage from "@bahmutov/cypress-code-coverage/plugin"
// https://github.com/bahmutov/cypress-watch-and-reload
import reload from "cypress-watch-and-reload/plugins"

export default defineConfig({
  defaultBrowser: "electron",

  e2e: {
    // baseUrl, etc
    baseUrl: "http://localhost:5173/",
    viewportHeight: 1000,
    experimentalRunAllSpecs: true,
    env: {
      // watch all the source files and re-run the current
      // spec file when any of them change
      "cypress-watch-and-reload": {
        watch: ["src/**"],
      },
    },

    setupNodeEvents(on, config) {
      codeCoverage(on, config)
      // reload(on, config)

      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
})
