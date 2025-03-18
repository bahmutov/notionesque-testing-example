// https://dev.to/samelawrence/how-i-implement-drag-and-drop-in-my-cypress-tests-ppg
const dragAndDrop = (dragLocator, dropLocator) => {
  cy.get(dragLocator)
    .realMouseDown({ button: "left", position: "center" })
    .realMouseMove(0, 10, { position: "center" })
    .wait(200)
  cy.get(dropLocator).realMouseMove(0, 0, { position: "center" }).realMouseUp()
}
describe("App Kanban", () => {
  it("lets the user drag the tasks to change their priority", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTask("Write code", "Write code description")
    cy.addTask("Write tests", "Write tests description")
    cy.addTask("Write documentation", "Write documentation description")
    cy.get('[data-cy="task-row"]')
      .should("have.length", 3)
      .find('[data-cy="task-priority"]')
      .should("read", ["none", "none", "none"])

    cy.step("Switch to Kanban view")
    cy.contains("button", "Kanban").click()
    cy.get('[data-cy="kanban-view"]').should("be.visible")
    cy.contains('[data-cy="kanban-column"]', "None (3)")
      .find("[data-cy=kanban-card]")
      .should("have.length", 3)
      .find("[data-cy=title]")
      .should("read", ["Write code", "Write tests", "Write documentation"])

    cy.step('Drag and drop the "Write tests" card')
    dragAndDrop(
      "[data-cy=kanban-card]:nth-child(2)",
      "[data-rfd-droppable-id=low]",
    )

    cy.section("Confirm the updated columns")
    cy.step("None column")
    cy.get("[data-column=priority-none]")
      .find("[data-cy=kanban-card]")
      .should("have.length", 2)
      .find("[data-cy=title]")
      .should("read", ["Write code", "Write documentation"])
    cy.step("Low column")
    cy.get("[data-column=priority-low]")
      .find("[data-cy=kanban-card]")
      .should("have.length", 1)
      .find("[data-cy=title]")
      .should("read", ["Write tests"])
  })

  it("deletes the item", () => {
    cy.step("Create 3 tasks")
    cy.home()
    cy.addTask("Write code", "Write code description")
    cy.addTask("Write tests", "Write tests description")
    cy.addTask("Write documentation", "Write documentation description")
    cy.get('[data-cy="task-row"]').should("have.length", 3)

    cy.step("Switch to Kanban view")
    cy.contains("button", "Kanban").click()
    cy.get('[data-cy="kanban-view"]').should("be.visible")
    cy.get("[data-cy=kanban-card]")
      .should("have.length", 3)
      .find("[data-cy=title]")
      .should("read", ["Write code", "Write tests", "Write documentation"])

    cy.step("Delete card")
    cy.window().then(win => cy.stub(win, "confirm").as("confirm").returns(true))
    cy.contains('[data-cy="kanban-card"]', "Write documentation")
      .contains("button", "Delete")
      .click()
    cy.get("@confirm").should("be.calledOnce")
    cy.get("[data-cy=kanban-card]")
      .should("have.length", 2)
      .find("[data-cy=title]")
      .should("read", ["Write code", "Write tests"])
  })
})
