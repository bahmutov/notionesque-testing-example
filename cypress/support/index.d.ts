/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    home(): Chainable<void>
    addTask(title: string, description: string): Chainable<void>
  }
}
