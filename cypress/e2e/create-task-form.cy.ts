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

  it("edits an existing task description", () => {
    const initialTitle = "Test Task"
    const initialDesc = "Initial description"
    const updatedDesc = "Updated description"

    cy.home()
    cy.addTasks([{ title: initialTitle, description: initialDesc }])

    cy.step("Find the task and click edit")
    cy.get(Selectors.task.row)
      .should("have.length", 1)
      .contains("button", "Edit")
      .click()

    cy.step("Verify modal is shown and update description")
    cy.get(Selectors.taskModal.form)
      .should("be.visible")
      .within(() => {
        cy.get(Selectors.taskModal.title).should("have.value", initialTitle)
        cy.get(Selectors.taskModal.description)
          .should("have.value", initialDesc)
          .clear()
          .type(updatedDesc)
        cy.contains("button", "Update").click()
      })

    cy.step("Verify modal is closed and description is updated")
    cy.get(Selectors.taskModal.form).should("not.exist")
    cy.get(Selectors.task.row)
      .should("have.length", 1)
      .first()
      .within(() => {
        cy.get(Selectors.task.title).should("have.text", initialTitle)
        cy.get(Selectors.task.description).should("have.text", updatedDesc)
      })
  })
})
