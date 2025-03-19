/// <reference path="./index.d.ts" />

// https://github.com/bahmutov/cypress-code-coverage
import "@bahmutov/cypress-code-coverage/support"
import "cypress-plugin-steps"
import "cypress-map"
import "cypress-real-events"
import "cypress-cdp"
import "cypress-watch-and-reload/support"

Cypress.Commands.add("home", () => {
  cy.visit("/").wait(100)
  cy.contains("header", "Notionesque")
  cy.get('[data-cy="zero-tasks"]').should("be.visible")
  cy.get('[data-cy="search-input"]').should("be.visible")
})

Cypress.Commands.add(
  "addTask",
  (
    title: string,
    description: string,
    priority?: Cypress.priority,
    status?: Cypress.status,
  ) => {
    cy.section(`Add task "${title}"`)
    cy.contains("button", "Create Task").click()

    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.get("input[name=title]").type(title)
        cy.get("textarea[name=description]").type(description)

        if (status) {
          cy.get('[data-cy="status-select"]').select(status)
        }
        if (priority) {
          cy.get('[data-cy="priority-select"]').select(priority)
        }
        cy.contains("button", "Create").click()
      })
    cy.get("form[data-cy=task-form]").should("not.exist")
  },
)
