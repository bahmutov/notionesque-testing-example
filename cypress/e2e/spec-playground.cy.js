describe("App", () => {
  it("loads 4 tasks", () => {
    cy.home()

    cy.addTasks([
      {
        title: "Complete project documentation",
        description: "Document all features and APIs",
      },
      {
        title: "Review pull requests",
        description: "Review and merge pending PRs",
      },
      {
        title: "Update dependencies",
        description: "Update npm packages to latest versions",
      },
      {
        title: "Write unit tests",
        description: "Add test coverage for core features",
      },
    ])

    // Verify there are 4 task rows
    cy.get('[data-cy="task-row"]').should("have.length", 4)

    // Verify the title of each task, the tasks are in reverse order of creation
    cy.get('[data-cy="task-title"]').should("read", [
      "Write unit tests",
      "Update dependencies",
      "Review pull requests",
      "Complete project documentation",
    ])
  })

  it("immediately starts with 5 tasks", () => {
    cy.home()

    cy.addTasks([
      {
        title: "Task 1",
        description: "Description for task 1",
      },
      {
        title: "Task 2",
        description: "Description for task 2",
      },
      {
        title: "Task 3",
        description: "Description for task 3",
      },
      {
        title: "Task 4",
        description: "Description for task 4",
      },
      {
        title: "Task 5",
        description: "Description for task 5",
      },
    ])
  })

  it("shows the same items in List and Kanban views", () => {
    cy.home()

    cy.addTasks([
      { title: "Task 1", description: "Description 1", priority: "low" },
      { title: "Task 2", description: "Description 2", priority: "medium" },
      { title: "Task 3", description: "Description 3", priority: "high" },
    ])

    // first we are in the List view
    cy.get('[data-cy="list-view"]').should("exist")
    cy.get('[data-cy="kanban-view"]').should("not.exist")

    // then we switch to the Kanban view
    cy.contains("button", "Kanban").click()

    // Verify we switched views
    cy.get('[data-cy="list-view"]').should("not.exist")
    cy.get('[data-cy="kanban-view"]').should("exist")
    cy.get('[data-cy="kanban-card"]').should("have.length", 3)

    // go back to the List view
    cy.contains("button", "List").click()

    // Verify we switched views
    cy.get('[data-cy="list-view"]').should("exist")
    cy.get('[data-cy="kanban-view"]').should("not.exist")
  })
})
