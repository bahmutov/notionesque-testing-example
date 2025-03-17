describe("App", () => {
  it("loads", () => {
    cy.visit("/")
    cy.contains("header", "Notionesque")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
  })

  it("creates a task", () => {
    cy.step("Create a task")
    cy.visit("/").wait(100)
    cy.contains("header", "Notionesque")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
    cy.get('[data-cy="search-input"]').should("be.visible")
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
    cy.step("Check the created task")
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

  it("edits a task", () => {
    cy.step("Create a task")
    cy.visit("/").wait(100)
    cy.contains("header", "Notionesque")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
    cy.get('[data-cy="search-input"]').should("be.visible")
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

  it("deletes a task", () => {
    cy.step("Create a task")
    cy.visit("/").wait(100)
    cy.contains("header", "Notionesque")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
    cy.get('[data-cy="search-input"]').should("be.visible")
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
    cy.visit("/").wait(100)
    cy.contains("header", "Notionesque")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
    cy.get('[data-cy="search-input"]').should("be.visible")
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
    cy.visit("/").wait(100)
    cy.contains("header", "Notionesque")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
    cy.get('[data-cy="search-input"]').should("be.visible")
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
    cy.step("Edit the task")
    cy.get('[data-cy="task-row"]').should("have.length", 1)

    cy.get('[data-cy="select-all"]').check()
    cy.get('[data-cy="selected-tasks"]').should("have.text", "1 task selected")
    cy.contains("button", "Delete Selected").click()
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
  })
})
