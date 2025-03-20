describe("App List View", () => {
  beforeEach(() => {
    cy.home()
    cy.addTasks([
      { title: "Test Task 1", description: "Test Task Description 1" },
      { title: "Test Task 2", description: "Test Task Description 2" },
      { title: "Test Task 3", description: "Test Task Description 3" },
    ])
  })

  it("selects and deletes one task", () => {
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

  it("selects tasks one by one", () => {
    cy.get('[data-cy="task-row"]')
      .first()
      .find('[data-cy="select-task"]')
      .check()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "1 task selected")
    cy.get('[data-cy="task-row"]').eq(1).find('[data-cy="select-task"]').check()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "2 tasks selected")
    cy.get('[data-cy="task-row"]').eq(2).find('[data-cy="select-task"]').check()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "3 tasks selected")

    cy.step("Deselect the tasks one by one")
    cy.get('[data-cy="task-row"]')
      .first()
      .find('[data-cy="select-task"]')
      .uncheck()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "2 tasks selected")
    cy.get('[data-cy="task-row"]')
      .eq(1)
      .find('[data-cy="select-task"]')
      .uncheck()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "1 task selected")
    cy.get('[data-cy="task-row"]')
      .eq(2)
      .find('[data-cy="select-task"]')
      .uncheck()
    cy.get('[data-cy="selected-tasks"]').should("not.exist")
  })
})
