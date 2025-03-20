describe("App", () => {
  it("loads 4 tasks", () => {
    cy.home()

    cy.addTask(
      "Complete project documentation",
      "Document all features and APIs",
    )
    cy.addTask("Review pull requests", "Review and merge pending PRs")
    cy.addTask("Update dependencies", "Update npm packages to latest versions")
    cy.addTask("Write unit tests", "Add test coverage for core features")

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
})
