describe("App", () => {
  it("deletes a task", () => {
    cy.step("Create a task")
    cy.home()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTasks([task])
    cy.step("Delete the task")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .first()
      .contains("button", "Delete")
      .click()
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
  })

  it("updates task priority", () => {
    cy.step("Create a task")
    cy.home()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTasks([task])
    cy.get("form[data-cy=task-form]").should("not.exist")
    cy.step("Edit the task")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .first()
      .contains("button", "Edit")
      .click()

    cy.get("form[data-cy=task-form]")
      .should("be.visible")
      .within(() => {
        cy.get("[data-cy=priority-select]").select("high")
        cy.contains("button", "Update").click()
      })

    cy.get('[data-cy="task-row"]')
      .should("have.length", 1)
      .first()
      .find("[data-cy=task-priority]")
      .should("have.text", "high")
  })

  it("deletes all selected tasks", () => {
    cy.step("Create a task")
    cy.home()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTasks([task])

    cy.step("Edit the task")
    cy.get('[data-cy="task-row"]').should("have.length", 1)

    cy.get('[data-cy="select-all"]').check()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "1 task selected")

    cy.step("Stub the window.confirm call")
    cy.window().then(win => {
      cy.stub(win, "confirm").as("confirm").returns(true)
    })
    cy.contains("button", "Delete Selected").click()
    cy.get("@confirm").should(
      "have.been.calledOnceWithExactly",
      "Are you sure you want to delete 1 tasks?",
    )
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
  })

  it("does not delete all tasks if the user cancels the Delete", () => {
    cy.step("Create a task")
    cy.home()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTasks([task])

    cy.step("Edit the task")
    cy.get('[data-cy="task-row"]').should("have.length", 1)

    cy.get('[data-cy="select-all"]').check()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "1 task selected")

    cy.step("Stub the window.confirm call")
    cy.window().then(win => {
      cy.stub(win, "confirm").as("confirm").returns(false)
    })
    cy.contains("button", "Delete Selected").click()
    cy.get("@confirm").should(
      "have.been.calledOnceWithExactly",
      "Are you sure you want to delete 1 tasks?",
    )
    cy.get('[data-cy="zero-tasks"]').should("not.exist")
    cy.get('[data-cy="task-row"]').should("have.length", 1)
  })
})
