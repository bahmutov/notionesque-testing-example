describe("App", () => {
  it("edits a task", () => {
    cy.step("Create a task")
    cy.home()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTasks([task])

    cy.step("Edit the task")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .first()
      .contains("button", "Edit")
      .click()

    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.get("input[name=title]")
          .should("have.value", task.title)
          .clear()
          .type(task.title + " updated")
        cy.get("textarea[name=description]")
          .should("have.value", task.description)
          .type(" updated")
        cy.contains("button", "Update").click()
      })

    cy.step("Check the updated task")
    cy.get("form[data-cy=task-form]").should("not.exist")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .first()
      .within(() => {
        cy.get("[data-cy=task-title]").should(
          "have.text",
          task.title + " updated",
        )
        cy.get("[data-cy=task-description]").should(
          "have.text",
          task.description + " updated",
        )
      })
  })
})
