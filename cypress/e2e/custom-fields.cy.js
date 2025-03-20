import { Selectors } from "../support/selectors"

describe("App", () => {
  it("adds a task with custom fields", () => {
    cy.home()
    cy.contains("button", "Create Task").click()

    cy.step("Adding empty task does not work")
    cy.get(Selectors.TaskModal.form)
      .should("be.visible")
      .within(() => {
        cy.get(Selectors.TaskModal.createButton).click()
      })

    cy.get(Selectors.TaskModal.form)
      .should("be.visible")
      .within(() => {
        cy.get(Selectors.TaskModal.title).type("My task")
        cy.get(Selectors.TaskModal.toggleCustomFields).click()
        cy.get(Selectors.CustomFields.container)
          .should("be.visible")
          .within(() => {
            cy.get(Selectors.CustomFields.addField)
              .should("be.visible")
              .within(() => {
                cy.get(Selectors.CustomFields.newFieldName).type("Task URL")
                cy.get(Selectors.CustomFields.newFieldValue).type(
                  "https://acme.com",
                )
                cy.get(Selectors.CustomFields.addFieldButton).click()
              })

            cy.step("Confirm the custom field")
            cy.get(Selectors.CustomFields.field).should("have.length", 1)
          })
        cy.get(Selectors.TaskModal.createButton).click()
      })

    cy.step("Confirm the created task")
    cy.get(Selectors.TaskModal.form).should("not.exist")
    cy.get(Selectors.Kanban.viewButton).click()
    cy.contains(Selectors.Kanban.card, "My task")
      .find(Selectors.CustomFields.field)
      .should("have.length", 1)
      .first()
      .should("have.text", "Task URL: https://acme.com")

    cy.step("Edit the task and delete the custom field")
    cy.contains(Selectors.Kanban.card, "My task")
      .find(Selectors.Kanban.editButton)
      .click()
    cy.get(Selectors.TaskModal.form)
      .should("be.visible")
      .within(() => {
        cy.contains(Selectors.CustomFields.field, "Task URL")
          .find(Selectors.CustomFields.deleteButton)
          .click()
        cy.get(Selectors.CustomFields.field).should("not.exist")
        cy.get(Selectors.TaskModal.updateButton).click()
      })

    cy.step("Confirm the custom field is deleted")
    cy.get(Selectors.TaskModal.form).should("not.exist")
    cy.contains(Selectors.Kanban.card, "My task")
      .find(Selectors.CustomFields.field)
      .should("not.exist")
  })
})
