describe("App", () => {
  it("shows tasks in Kanban view", () => {
    cy.step("Create a task")
    cy.home()
    cy.contains("button", "List").should("have.attr", "data-active", "true")
    cy.contains("button", "Kanban").should("have.attr", "data-active", "false")

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTasks([task])

    cy.step("Task in List view")
    cy.get('[data-cy="task-row"]').should("have.length", 1)
    cy.step("Task in Kanban view")
    cy.contains("button", "Kanban").click()
    cy.contains("button", "Kanban").should("have.attr", "data-active", "true")
    cy.contains("button", "List").should("have.attr", "data-active", "false")

    cy.step("Kanban view")
    cy.get('[data-cy="kanban-view"]').should("be.visible")
    cy.get('[data-cy="kanban-column-title"]').should("read", [
      "None (1)",
      "Low (0)",
      "Medium (0)",
      "High (0)",
      "Urgent (0)",
    ])
    cy.step('Task in "None" column')
    cy.get('[data-cy="kanban-view"]')
      .contains('[data-cy="kanban-column"]', "None")
      .find("[data-cy=kanban-card]")
      .should("have.length", 1)
  })
})
