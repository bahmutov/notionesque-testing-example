describe("App Kanban", () => {
  it("switches from List to Kanban and back", () => {
    cy.home()
    cy.contains("button", "List").should("have.attr", "data-active", "true")
    cy.contains("button", "Kanban").should("have.attr", "data-active", "false")
    cy.contains("button", "Kanban").click()
    cy.contains("button", "List").should("have.attr", "data-active", "false")
    cy.contains("button", "Kanban").should("have.attr", "data-active", "true")
    cy.step("Go to List")
    cy.contains("button", "List").click()
    cy.contains("button", "List").should("have.attr", "data-active", "true")
    cy.contains("button", "Kanban").should("have.attr", "data-active", "false")
  })

  it("edits a task", () => {
    cy.home()
    cy.addTask("Write code", "Write code description")
    cy.step("Switch to Kanban view")
    cy.contains("button", "Kanban").click()
    cy.get('[data-cy="kanban-view"]').should("be.visible")

    cy.step("Edit the task")
    cy.contains('[data-cy="kanban-card"]', "Write code")
      .contains("button", "Edit")
      .click()

    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.get("input[name=title]").clear().type("Updated task")
        cy.get('[data-cy="priority-select"]').select("High")
        cy.contains("button", "Update").click()
      })

    cy.section("Checking")
    cy.step("Confirm the updated task")
    cy.get("[data-column=priority-none]")
      .find("[data-cy=kanban-card]")
      .should("not.exist")
    cy.get("[data-column=priority-high]")
      .find("[data-cy=kanban-card]")
      .should("have.length", 1)
      .find("[data-cy=title]")
      .should("have.text", "Updated task")
      .scrollIntoView()

    cy.todo("Check the task description")
  })
})
