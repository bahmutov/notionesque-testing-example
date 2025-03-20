describe("Mobile", { viewportHeight: 667, viewportWidth: 375 }, () => {
  it("creates a task", () => {
    cy.home()
    cy.addTask("Test Task", "Test Task Description")
    cy.get('[data-cy="task-row"]').should("have.length", 1)
    cy.get('[data-cy="task-title"]').should("have.text", "Test Task")
    cy.get('[data-cy="task-description"]').should(
      "have.text",
      "Test Task Description",
    )

    cy.step("Kanban view")
    cy.contains("button", "Kanban").click()
    cy.get('[data-cy="kanban-view"]').should("be.visible")
    cy.get('[data-cy="kanban-column"]')
      .should("have.length", 5)
      .find('[data-cy="kanban-column-title"]')
      .map("innerText")
      .print()
      .should("deep.equal", [
        "None (1)",
        "Low (0)",
        "Medium (0)",
        "High (0)",
        "Urgent (0)",
      ])

    cy.step("Edit the task")
    cy.get('[data-cy="task-card"]')
      .first()
      .within(() => {
        cy.get('[data-cy="title"]').should("have.text", "Test Task")
        cy.contains("Edit").click()
      })
    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .find('[name="title"]')
      .type(" updated")

    cy.step("Cancel the edit")
    cy.get("form[data-cy=task-form]").contains("button", "Cancel").click()
    cy.get("form[data-cy=task-form]").should("not.exist")
    cy.get('[data-cy="task-card"]')
      .first()
      .find('[data-cy="title"]')
      .should("have.text", "Test Task")
  })
})
