describe("App search", () => {
  it("finds task by partial text match", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTask("Write code", "Write code description")
    cy.addTask("Write tests", "Write tests description")
    cy.addTask("Write documentation", "Write documentation description")
    cy.get('[data-cy="task-row"]').should("have.length", 3)

    cy.step("Search for task documentation")
    cy.get('[data-cy="search-input"]')
      .should("have.attr", "placeholder", "Search tasks...")
      .type("documentation")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .find("[data-cy=task-title]")
      .should("have.text", "Write documentation")

    cy.step("Case-insensitive search")
    cy.get('[data-cy="search-input"]').clear().type("WRITE C")
    cy.get('[data-cy="task-row"]')
      .find("[data-cy=task-title]")
      .should("have.text", "Write code")
  })

  it("filters search results by the status", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTask("Write code", "Write code description", undefined, "In Progress")
    cy.addTask("Write tests", "Write tests description", undefined, "Completed")
    cy.addTask(
      "Write documentation",
      "Write documentation description",
      undefined,
      "Not Started",
    )
    cy.get('[data-cy="task-row"]')
      .should("have.length", 3)
      .find('[data-cy="task-status"]')
      .should("read", ["not started", "completed", "in progress"])

    cy.step('Filter the search by "Completed" status')
    cy.get('[data-cy="search-status-filter"]').select("Completed")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .should("include.text", "Write tests")

    cy.get('[data-cy="search-input"]').type("documentation")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")

    cy.step("Filter all status")
    cy.get('[data-cy="search-status-filter"]').select("All Status")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .should("include.text", "Write documentation")
  })
})
