/// <reference types="cypress" />

declare namespace Cypress {
  type priority = "None" | "Low" | "Medium" | "High" | "Urgent"
  type status = "Not Started" | "In Progress" | "Completed"

  interface Chainable {
    home(): Chainable<void>
    addTask(
      title: string,
      description: string,
      priority?: priority,
      status?: status,
    ): Chainable<void>
  }
}
