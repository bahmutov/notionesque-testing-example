import { Selectors } from "../support/selectors"

describe("Create Task Form", () => {
  it("does not create a task with an empty title", () => {
    cy.home()
    cy.get(Selectors.taskModal.form).should("not.exist")
    cy.contains("button", "Create Task").click()
    cy.get(Selectors.taskModal.form)
      .should("be.visible")
      .within(() => {
        cy.get(Selectors.taskModal.title).should("have.value", "")
        cy.get(Selectors.taskModal.description)
          .should("have.value", "")
          .type("Some description")
        cy.contains("button", "Create").click()
      })
    cy.get(Selectors.taskModal.form)
      .should("be.visible")
      .find(Selectors.taskModal.title)
      .should("have.prop", "validity")
      .should("possess", "valid", false)
      .and("possess", "valueMissing", true)
  })
})
