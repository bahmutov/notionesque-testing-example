describe("App", () => {
  it("loads", () => {
    cy.visit("/")
    cy.contains("header", "Notionesque")
  })

  it("creates a task", () => {
    cy.visit("/")
    cy.contains("button", "Create Task").click()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.get("input[name=title]").type(task.title)
        cy.get("textarea[name=description]").type(task.description)
        cy.contains("button", "Create").click()
      })
    cy.get("form[data-cy=task-form]").should("not.exist")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .first()
      .within(() => {
        cy.get("[data-cy=task-title]").should("have.text", task.title)
        cy.get("[data-cy=task-description]").should(
          "have.text",
          task.description,
        )
        cy.get("[data-cy=task-status]").should("have.text", "not started")
        cy.get("[data-cy=task-priority]").should("have.text", "none")
      })
  })
})
