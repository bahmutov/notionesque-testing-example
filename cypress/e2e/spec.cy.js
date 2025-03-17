describe("App", () => {
  it("loads", () => {
    cy.visit("/")
    cy.contains("header", "Notionesque")
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
  })

  it("creates a task", () => {
    cy.step("Create a task")
    cy.home()
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

  it("shows tasks in Kanban view", () => {
    cy.step("Create a task")
    cy.home()
    cy.contains("button", "List").should("have.attr", "data-active", "true")
    cy.contains("button", "Kanban").should("have.attr", "data-active", "false")
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
    cy.step("Task in List view")
    cy.get('[data-cy="task-row"]').should("have.length", 1)
    cy.step("Task in Kanban view")
    cy.contains("button", "Kanban").click()
    cy.contains("button", "Kanban").should("have.attr", "data-active", "true")
    cy.contains("button", "List").should("have.attr", "data-active", "false")

    cy.step("Kanban view")
    cy.get('[data-cy="kanban-view"]').should("be.visible")
    cy.get('[data-cy="kanban-column-title"]').should("read", [
      "None (1)",
      "Low (0)",
      "Medium (0)",
      "High (0)",
      "Urgent (0)",
    ])
    cy.step('Task in "None" column')
    cy.get('[data-cy="kanban-view"]')
      .contains('[data-cy="kanban-column"]', "None")
      .find("[data-cy=kanban-card]")
      .should("have.length", 1)
  })

  it("edits a task", () => {
    cy.step("Create a task")
    cy.home()
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
    cy.home()
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
    cy.home()
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
    cy.home()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTask(task.title, task.description)

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

  it("does not delete all tasks if the user cancels", () => {
    cy.step("Create a task")
    cy.home()

    const task = {
      title: "Test Task",
      description: "Test Task Description",
    }
    cy.addTask(task.title, task.description)

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

  it("sorts tasks by title", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTask("Task 1", "Task 1 Description")
    cy.addTask("Task 2", "Task 2 Description")
    cy.addTask("Task 3", "Task 3 Description")
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
    cy.addTask("Task 1", "Task 1 Description", "Low")
    cy.addTask("Task 2", "Task 2 Description", "High")
    cy.addTask("Task 3", "Task 3 Description")
    cy.get('[data-cy="task-row"]').should("have.length", 3)

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
})
