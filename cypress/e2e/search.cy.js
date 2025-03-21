import { Selectors } from "../support/selectors"

describe("App search", () => {
  it("finds task by partial text match", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTasks([
      { title: "Write code", description: "Write code description" },
      { title: "Write tests", description: "Write tests description" },
      {
        title: "Write documentation",
        description: "Write documentation description",
      },
    ])
    cy.get(Selectors.task.row).should("have.length", 3)

    cy.step("Search for task documentation")
    cy.get(Selectors.filters.search)
      .should("have.attr", "placeholder", "Search tasks...")
      .type("documentation")
    cy.get(Selectors.task.row)
      .should("have.length", 1)
      .find(Selectors.task.title)
      .should("have.text", "Write documentation")

    cy.step("Case-insensitive search")
    cy.get(Selectors.filters.search).clear().type("WRITE C")
    cy.get(Selectors.task.row)
      .find(Selectors.task.title)
      .should("have.text", "Write code")
  })

  it("filters search results by the task status", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTasks([
      {
        title: "Write code",
        description: "Write code description",
        status: "in progress",
      },
      {
        title: "Write tests",
        description: "Write tests description",
        status: "completed",
      },
      {
        title: "Write documentation",
        description: "Write documentation description",
        status: "not started",
      },
    ])
    cy.get(Selectors.task.row)
      .should("have.length", 3)
      .find(Selectors.task.status)
      .should("read", ["not started", "completed", "in progress"])

    cy.step('Filter the search by "Completed" status')
    cy.get(Selectors.filters.status).select("Completed")
    cy.get(Selectors.task.row)
      .should("have.length", 1)
      .should("include.text", "Write tests")

    cy.get(Selectors.filters.search).type("documentation")
    cy.get(Selectors.zeroTasks).should("be.visible")

    cy.step("Filter all status")
    cy.get(Selectors.filters.status).select("All Status")
    cy.get(Selectors.task.row)
      .should("have.length", 1)
      .should("include.text", "Write documentation")
  })

  it("filters search results by the task priority", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTasks([
      {
        title: "Write code",
        description: "Write code description",
        priority: "urgent",
      },
      {
        title: "Write tests",
        description: "Write tests description",
        priority: "medium",
      },
      {
        title: "Write documentation",
        description: "Write documentation description",
        priority: "low",
      },
    ])
    cy.get(Selectors.task.row)
      .should("have.length", 3)
      .find(Selectors.task.priority)
      .should("read", ["low", "medium", "urgent"])

    cy.step('Filter tasks with "Low" priority')
    cy.get(Selectors.filters.priority).select("Low")
    cy.get(Selectors.task.row)
      .should("have.length", 1)
      .should("include.text", "Write documentation")

    cy.step("Show all priorities")
    cy.get(Selectors.filters.priority).select("All Priorities")
    cy.get(Selectors.task.row).should("have.length", 3)
  })
})
