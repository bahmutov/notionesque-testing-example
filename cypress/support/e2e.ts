/// <reference path="./index.d.ts" />

// https://github.com/bahmutov/cypress-code-coverage
import "@bahmutov/cypress-code-coverage/support"
import "cypress-plugin-steps"
import "cypress-map"
import "cypress-real-events"
import "cypress-cdp"
// import "cypress-watch-and-reload/support"
import "cypress-fail-fast"

// custom commands in this project
import "./commands"
