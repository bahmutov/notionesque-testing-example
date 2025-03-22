import spok from "cy-spok"

describe("Task Slice", () => {
  beforeEach(() => {
    cy.home()
  })

  it("should throw an error on invalid status", () => {
    cy.window({ log: false })
      .its("store", { log: false })
      .then(store => {
        expect(() => {
          store.dispatch({
            type: "tasks/addTask",
            payload: {
              title: "Test Task",
              description: "Test Description",
              status: "invalid",
              priority: "none",
              customFields: {},
            },
          })
        }).to.throw(`Invalid status: invalid`)
      })
  })

  it("should throw an error on invalid priority", () => {
    cy.window({ log: false })
      .its("store", { log: false })
      .then(store => {
        expect(() => {
          store.dispatch({
            type: "tasks/addTask",
            payload: {
              title: "Test Task",
              description: "Test Description",
              status: "not started",
              priority: "invalid",
              customFields: {},
            },
          })
        }).to.throw(`Invalid priority: invalid`)
      })
  })
})
