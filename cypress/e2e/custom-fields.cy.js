describe("App", () => {
  it("adds a task with custom fields", () => {
    cy.home()
    cy.contains("button", "Create Task").click()

    cy.step("Adding empty task does not work")
    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Create").click()
      })

    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.get("input[name=title]").type("My task")
        cy.get("button[data-cy=toggle-custom-fields]").click()
        cy.get("[data-cy=custom-fields]")
          .should("be.visible")
          .within(() => {
            cy.get('[data-cy="add-custom-field"]')
              .should("be.visible")
              .within(() => {
                cy.get('[data-cy="new-custom-field-name"]').type("Task URL")
                cy.get('[data-cy="new-custom-field-value"]').type(
                  "https://acme.com",
                )
                cy.contains("button", "Add Field").click()
              })

            cy.step("Confirm the custom field")
            cy.get('[data-cy="custom-field"]').should("have.length", 1)
          })
        cy.contains("button", "Create").click()
      })

    cy.step("Confirm the created task")
    cy.get("form[data-cy=task-form]").should("not.exist")
    cy.contains("button", "Kanban").click()
    cy.contains("[data-cy=kanban-card]", "My task")
      .find('[data-cy="custom-field"]')
      .should("have.length", 1)
      .first()
      .should("have.text", "Task URL: https://acme.com")
  })
})
