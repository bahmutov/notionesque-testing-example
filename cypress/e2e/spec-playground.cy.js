describe("App", () => {
  it("loads 4 tasks", () => {
    // Visit the home page
    cy.home()

    // Add 4 tasks with different titles
    cy.addTask(
      "Complete project documentation",
      "Write detailed documentation for the project",
    )
    cy.addTask("Review pull requests", "Review and merge pending PRs")
    cy.addTask("Update dependencies", "Update npm packages to latest versions")
    cy.addTask("Write unit tests", "Add test coverage for new features")

    // Verify there are 4 task rows
    cy.get('[data-cy="task-row"]').should("have.length", 4)

    // Verify the title of each task
    cy.get('[data-cy="task-title"]').should("read", [
      "Complete project documentation",
      "Review pull requests",
      "Update dependencies",
      "Write unit tests",
    ])
  })
})
