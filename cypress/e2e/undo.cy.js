describe("App undo", () => {
  it("removes and adds back tasks", () => {
    cy.home()
    cy.step("No actions to undo/redo")
    cy.get('[data-cy="undo-redo"]')
      .should("be.visible")
      .within(() => {
        cy.get("[data-testid=undo-button]").should("be.disabled")
        cy.get("[data-testid=redo-button]").should("be.disabled")
      })

    cy.step("Create 3 tasks")
    cy.addTask("Write code", "Write code description")
    cy.addTask("Write tests", "Write tests description")
    cy.addTask("Write documentation", "Write documentation description")
    cy.get("[data-cy=task-title]").should("read", [
      "Write documentation",
      "Write tests",
      "Write code",
    ])

    cy.step("Undo the last task")
    cy.get('[data-cy="undo-redo"]')
      .should("be.visible")
      .find("[data-testid=undo-button]")
      .click()
    cy.get("[data-cy=task-title]").should("read", ["Write tests", "Write code"])

    cy.step("Redo the last task")
    cy.get('[data-cy="undo-redo"]')
      .should("be.visible")
      .find("[data-testid=redo-button]")
      .click()
    cy.get("[data-cy=task-title]").should("read", [
      "Write documentation",
      "Write tests",
      "Write code",
    ])

    cy.step("Complete the task")
    cy.get('[data-cy="task-status"]').should("read", [
      "not started",
      "not started",
      "not started",
    ])
    cy.get('[data-cy="task-row"]').first().contains("button", "Edit").click()
    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.get('[data-cy="status-select"]').select("Completed")
        cy.contains("button", "Update").click()
      })
    cy.get('[data-cy="task-status"]').should("read", [
      "completed",
      "not started",
      "not started",
    ])

    cy.step("Undo the completed task")
    cy.get('[data-cy="undo-redo"]')
      .should("be.visible")
      .find("[data-testid=undo-button]")
      .click()
    cy.get('[data-cy="task-status"]').should("read", [
      "not started",
      "not started",
      "not started",
    ])

    cy.step("Redo the completed task")
    cy.get('[data-cy="undo-redo"]')
      .should("be.visible")
      .find("[data-testid=redo-button]")
      .click()
    cy.get('[data-cy="task-status"]').should("read", [
      "completed",
      "not started",
      "not started",
    ])

    cy.step("No more actions to redo")
    cy.get('[data-cy="undo-redo"]')
      .should("be.visible")
      .find("[data-testid=redo-button]")
      .should("be.disabled")
  })
})
