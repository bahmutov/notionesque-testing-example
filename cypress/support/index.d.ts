/// <reference types="cypress" />

declare namespace Cypress {
  type priority = "None" | "Low" | "Medium" | "High" | "Urgent"
  type status = "Not Started" | "In Progress" | "Completed"

  interface Chainable {
    /**
     * Go to the homepage and check the elements.
     * @param zeroTasks - If true, check for zero tasks.
     */
    home(zeroTasks?: boolean): Chainable<void>
    addTask(
      title: string,
      description: string,
      priority?: priority,
      status?: status,
    ): Chainable<void>

    addTasks(tasks: unknown[]): Chainable<void>
  }
}
