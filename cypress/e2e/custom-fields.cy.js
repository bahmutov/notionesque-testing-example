import { Selectors } from "../support/selectors"

describe("App", () => {
  it("adds a task with custom fields", () => {
    cy.home()
    cy.contains("button", "Create Task").click()

    cy.step("Adding empty task does not work")
    cy.get(Selectors.taskModal.form)
      .should("be.visible")
      .within(() => {
        cy.get(Selectors.taskModal.createButton).click()
      })

    cy.get(Selectors.taskModal.form)
      .should("be.visible")
      .within(() => {
        cy.get(Selectors.taskModal.title).type("My task")
        cy.get(Selectors.taskModal.toggleCustomFields).click()
        cy.get(Selectors.customFields.container)
          .should("be.visible")
          .within(() => {
            cy.get(Selectors.customFields.addField)
              .should("be.visible")
              .within(() => {
                cy.get(Selectors.customFields.newFieldName).type("Task URL")
                cy.get(Selectors.customFields.newFieldValue).type(
                  "https://example.com/task/123",
                )
                cy.get(Selectors.customFields.addFieldButton).click()
              })

            cy.step("Confirm the custom field")
            cy.get(Selectors.customFields.field).should("have.length", 1)
          })
        cy.get(Selectors.taskModal.createButton).click()
      })

    cy.step("Confirm the created task")
    cy.get(Selectors.taskModal.form).should("not.exist")
    cy.get(Selectors.kanban.viewButton).click()
    cy.contains(Selectors.kanban.card, "My task")
      .find(Selectors.customFields.field)
      .should("have.length", 1)
      .first()
      .should("have.text", "Task URL: https://example.com/task/123")

    cy.step("Edit the task and delete the custom field")
    cy.contains(Selectors.kanban.card, "My task")
      .find(Selectors.kanban.editButton)
      .click()
    cy.get(Selectors.taskModal.form)
      .should("be.visible")
      .within(() => {
        cy.contains(Selectors.customFields.field, "Task URL")
          .find(Selectors.customFields.deleteButton)
          .click()
        cy.get(Selectors.customFields.field).should("not.exist")
        cy.get(Selectors.taskModal.updateButton).click()
      })

    cy.step("Confirm the custom field is deleted")
    cy.get(Selectors.taskModal.form).should("not.exist")
    cy.contains(Selectors.kanban.card, "My task")
      .find(Selectors.customFields.field)
      .should("not.exist")
  })
})
