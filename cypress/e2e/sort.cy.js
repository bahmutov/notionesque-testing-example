// @ts-check

describe("App", () => {
  it("sorts tasks by title", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTasks([
      { title: "Task 1", description: "Task 1 Description" },
      { title: "Task 2", description: "Task 2 Description" },
      { title: "Task 3", description: "Task 3 Description" },
    ])
    cy.get('[data-cy="task-row"]').should("have.length", 3)

    cy.step('Sort by "Title" descending')
    cy.get('[data-cy="task-title-header"]').click()
    cy.get('[data-cy="task-title-header"]').should("have.text", "Title ↓")
    cy.get("[data-cy=task-title]").should("read", [
      "Task 3",
      "Task 2",
      "Task 1",
    ])

    cy.step('Sort by "Title" ascending')
    cy.get('[data-cy="task-title-header"]').click()
    cy.get('[data-cy="task-title-header"]').should("have.text", "Title ↑")
    cy.get("[data-cy=task-title]").should("read", [
      "Task 1",
      "Task 2",
      "Task 3",
    ])
  })

  it("sorts tasks by priority", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTasks([
      { title: "Task 1", description: "Task 1 Description", priority: "low" },
      { title: "Task 2", description: "Task 2 Description", priority: "high" },
      { title: "Task 3", description: "Task 3 Description" },
    ])
    cy.get('[data-cy="task-row"]').should("have.length", 3)
    cy.step("initial priority")
    cy.get("[data-cy=task-priority]").should("read", ["none", "high", "low"])

    cy.step('Sort by "Priority" ascending')
    cy.get('[data-cy="task-priority-header"]').click()
    cy.get('[data-cy="task-priority-header"]').should("have.text", "Priority ↓")
    cy.get("[data-cy=task-priority]").should("read", ["none", "low", "high"])
    cy.get("[data-cy=task-title]").should("read", [
      "Task 3",
      "Task 1",
      "Task 2",
    ])

    cy.step('Sort by "Priority" descending')
    cy.get('[data-cy="task-priority-header"]').click()
    cy.get('[data-cy="task-priority-header"]').should("have.text", "Priority ↑")
    cy.get("[data-cy=task-priority]").should("read", ["high", "low", "none"])
  })

  it("sorts tasks by status", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTasks([
      {
        title: "Task 1",
        description: "Task 1 Description",
        status: "in progress",
      },
      {
        title: "Task 2",
        description: "Task 2 Description",
        status: "completed",
      },
      {
        title: "Task 3",
        description: "Task 3 Description",
        status: "not started",
      },
    ])
    cy.get('[data-cy="task-row"]').should("have.length", 3)

    cy.step("Initial status column")
    cy.get("[data-cy=task-status]").should("read", [
      "not started",
      "completed",
      "in progress",
    ])

    cy.step('Sort by "Status" ascending')
    cy.get('[data-cy="task-status-header"]').click()
    cy.get('[data-cy="task-status-header"]').should("have.text", "Status ↓")
    cy.get("[data-cy=task-status]").should("read", [
      "not started",
      "in progress",
      "completed",
    ])

    cy.step('Sort by "Status" descending')
    cy.get('[data-cy="task-status-header"]').click()
    cy.get('[data-cy="task-status-header"]').should("have.text", "Status ↑")
    cy.get("[data-cy=task-status]").should("read", [
      "completed",
      "in progress",
      "not started",
    ])
  })
})
