describe("App", () => {
  it("filters tasks by the updated timestamp", () => {
    cy.step("Create 3 tasks 10 seconds apart")

    const started = new Date("2023-01-01T00:00:00Z")
    cy.clock(started, ["Date"])
    cy.home()
    cy.addTask("Write code", "Write code description")

    cy.tick(10_000)
    cy.addTask("Write tests", "Write tests description")

    cy.tick(10_000)
    cy.addTask("Write documentation", "Write documentation description")

    cy.step("Confirm the created timestamps")
    cy.get('[data-cy="task-row"]')
      .find('[data-cy="task-updated"]')
      // the tasks are shown in the reverse order
      // the newest task is on top
      .should("read", [
        new Date(started.getTime() + 20_000).toLocaleString(),
        new Date(started.getTime() + 10_000).toLocaleString(),
        started.toLocaleString(),
      ])

    cy.step('Sort by "Updated" timestamp')
    cy.get('[data-cy="task-updated-header"]').click()
    cy.get('[data-cy="task-updated-header"]').should("have.text", "Updated ↓")
    cy.get('[data-cy="task-row"]')
      .find('[data-cy="task-updated"]')
      .should("read", [
        new Date(started.getTime() + 20_000).toLocaleString(),
        new Date(started.getTime() + 10_000).toLocaleString(),
        started.toLocaleString(),
      ])

    cy.step('Reverse sort by "Updated" timestamp')
    cy.get('[data-cy="task-updated-header"]').click()
    cy.get('[data-cy="task-updated-header"]').should("have.text", "Updated ↑")
    cy.get('[data-cy="task-row"]')
      .find('[data-cy="task-updated"]')
      .should("read", [
        started.toLocaleString(),
        new Date(started.getTime() + 10_000).toLocaleString(),
        new Date(started.getTime() + 20_000).toLocaleString(),
      ])
  })
})
