describe("App List View", () => {
  it("selects and deletes one task", () => {
    // create 3 tasks
    // select the middle task using the selector "data-cy="select-task"

    cy.step("Create 3 tasks")
    cy.home()
    cy.addTask("Test Task 1", "Test Task Description 1")
    cy.addTask("Test Task 2", "Test Task Description 2")
    cy.addTask("Test Task 3", "Test Task Description 3")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 3)
      .second()
      .find('[data-cy="select-task"]')
      .check()

    cy.step("Delete selected task")
    cy.get('[data-cy="selected-tasks"]').should("have.text", "1 task selected")
    cy.contains("button", "Delete Selected").click()
    cy.get('[data-cy="task-row"]').should("have.length", 2)
    cy.get('[data-cy="selected-tasks"]').should("not.exist")
    cy.contains("button", "Delete Selected").should("not.exist")
  })

  it("delete one of selected tasks", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTask("Test Task 1", "Test Task Description 1")
    cy.addTask("Test Task 2", "Test Task Description 2")
    cy.addTask("Test Task 3", "Test Task Description 3")
    cy.get('[data-cy="task-title"]').should("read", [
      "Test Task 3",
      "Test Task 2",
      "Test Task 1",
    ])
    cy.get('[data-cy="select-all"]').check()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "3 tasks selected")

    cy.step("Delete the last task")
    cy.get('[data-cy="task-row"]').last().contains("button", "Delete").click()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "2 tasks selected")
    cy.get('[data-cy="task-title"]').should("read", [
      "Test Task 3",
      "Test Task 2",
    ])
  })
})
