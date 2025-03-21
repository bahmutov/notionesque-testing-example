// https://dev.to/samelawrence/how-i-implement-drag-and-drop-in-my-cypress-tests-ppg
const dragAndDrop = (dragLocator, dropLocator) => {
  cy.get(dragLocator)
    .realMouseDown({ button: "left", position: "center" })
    .realMouseMove(0, 10, { position: "center" })
    .wait(200)
  cy.get(dropLocator).realMouseMove(0, 0, { position: "center" }).realMouseUp()
}

describe("App Kanban", () => {
  context("Drag and drop", () => {
    beforeEach(() => {
      cy.step("Create 3 tasks")
      cy.home()
      cy.addTasks([
        { title: "Write code", description: "Write code description" },
        {
          title: "Write tests",
          description: "Write tests description",
          priority: "low",
          status: "in progress",
        },
        {
          title: "Write documentation",
          description: "Write documentation description",
          priority: "high",
          status: "completed",
        },
      ])
    })

    it("lets the user drag the tasks to change their priority", () => {
      cy.get('[data-cy="task-row"]')
        .should("have.length", 3)
        .find('[data-cy="task-priority"]')
        .should("read", ["high", "low", "none"])

      cy.step("Switch to Kanban view")
      cy.contains("button", "Kanban").click()
      cy.get('[data-cy="kanban-view"]').should("be.visible")
      cy.contains('[data-cy="kanban-column"]', "None (1)")
        .find("[data-cy=kanban-card]")
        .should("have.length", 1)
        .find("[data-cy=title]")
        .should("read", ["Write code"])

      cy.step('Drag and drop the "Write tests" card')
      dragAndDrop(
        "[data-cy=kanban-card]:nth-child(1)",
        "[data-rfd-droppable-id=medium]",
      )

      cy.section("Confirm the updated columns")
      cy.step("None column")
      cy.get("[data-column=priority-none]")
        .should("contain", "None (0)")
        .find("[data-cy=kanban-card]")
        .should("have.length", 0)

      cy.step("Low column")
      cy.get("[data-column=priority-low]")
        .should("contain", "Low (1)")
        .find("[data-cy=kanban-card]")
        .should("have.length", 1)
        .find("[data-cy=title]")
        .should("read", ["Write tests"])

      cy.step("Medium column")
      cy.get("[data-column=priority-medium]")
        .should("contain", "Medium (1)")
        .find("[data-cy=kanban-card]")
        .should("have.length", 1)
        .find("[data-cy=title]")
        .should("read", ["Write code"])

      cy.step("High column")
      cy.get("[data-column=priority-high]")
        .should("contain", "High (1)")
        .find("[data-cy=kanban-card]")
        .should("have.length", 1)
        .find("[data-cy=title]")
        .should("read", ["Write documentation"])
    })

    it("deletes the item", () => {
      cy.step("Switch to Kanban view")
      cy.contains("button", "Kanban").click()
      cy.get('[data-cy="kanban-view"]').should("be.visible")
      cy.get("[data-cy=kanban-card]")
        .should("have.length", 3)
        .find("[data-cy=title]")
        .should("read", ["Write code", "Write tests", "Write documentation"])

      cy.step("Delete card")
      cy.window().then(win =>
        cy.stub(win, "confirm").as("confirm").returns(true),
      )
      cy.contains('[data-cy="kanban-card"]', "Write documentation")
        .contains("button", "Delete")
        .click()
      cy.get("@confirm").should("be.calledOnce")
      cy.get("[data-cy=kanban-card]")
        .should("have.length", 2)
        .find("[data-cy=title]")
        .should("read", ["Write code", "Write tests"])
    })

    it("shows cards with different statuses", () => {
      cy.step("Switch to Kanban view")
      cy.contains("button", "Kanban").click()
      cy.get('[data-cy="kanban-view"]').should("be.visible")

      cy.get('[data-column="priority-none"]')
        .find('[data-cy="kanban-card"]')
        .should("have.length", 1)
        .find('[data-cy="status"]')
        .should("have.text", "not started")
      cy.get('[data-column="priority-low"]')
        .find('[data-cy="kanban-card"]')
        .should("have.length", 1)
        .find('[data-cy="status"]')
        .should("have.text", "in progress")
      cy.get('[data-column="priority-high"]')
        .find('[data-cy="kanban-card"]')
        .should("have.length", 1)
        .find('[data-cy="status"]')
        .should("have.text", "completed")

      cy.step("Filter by status")
      cy.get('[data-cy="search-status-filter"]').select("In Progress")
      cy.get('[data-column="priority-none"]').find("[data-cy=no-tasks]")
      cy.get('[data-column="priority-low"]')
        .find('[data-cy="kanban-card"]')
        .should("have.length", 1)
      cy.get('[data-column="priority-medium"]').find("[data-cy=no-tasks]")
      cy.get('[data-column="priority-high"]').find("[data-cy=no-tasks]")
      cy.get('[data-column="priority-urgent"]').find("[data-cy=no-tasks]")
    })
  })
})
