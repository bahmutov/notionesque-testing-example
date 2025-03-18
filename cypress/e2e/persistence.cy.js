import spok from "cy-spok"

describe("App persistence", () => {
  it("persists the tasks", () => {
    cy.step("Create 2 tasks")
    // control the clock so we know the timestamps
    const timestamp = "2023-01-01T00:00:00.000Z"
    const started = new Date(timestamp)
    cy.clock(started, ["Date"])
    cy.home()
    cy.addTask("Write code", "Write code description")
    cy.addTask("Write tests", "Write tests description")

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

    cy.step("Check the local storage")
    cy.window()
      .its("localStorage")
      .invoke("getItem", "persist:tasks")
      .apply(JSON.parse)
      .should("have.keys", ["present", "_persist"])
      .its("present")
      .apply(JSON.parse)
      .should("have.keys", ["items"])
      .its("items")
      .then(items => {
        expect(items, "2 tasks").to.have.length(2)
        expect(items[0], "task 1").to.deep.include({
          createdAt: timestamp,
          customFields: {},
          description: "Write code description",
          priority: "none",
          status: "not started",
          title: "Write code",
          updatedAt: timestamp,
        })
        expect(items[0], "task 1 id").to.have.property("id").to.match(uuidRegex)

        expect(items[1], "task 2").to.deep.include({
          createdAt: timestamp,
          customFields: {},
          description: "Write tests description",
          priority: "none",
          status: "not started",
          title: "Write tests",
          updatedAt: timestamp,
        })
        expect(items[1], "task 2 id").to.have.property("id").to.match(uuidRegex)
      })
  })

  it("persists the tasks (spok version)", () => {
    cy.step("Create 2 tasks")
    // control the clock so we know the timestamps
    const timestamp = "2023-01-01T00:00:00.000Z"
    const started = new Date(timestamp)
    cy.clock(started, ["Date"])
    cy.home()
    cy.addTask("Write code", "Write code description")
    cy.addTask("Write tests", "Write tests description")

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

    cy.step("Check the local storage")
    cy.window()
      .its("localStorage")
      .invoke("getItem", "persist:tasks")
      .apply(JSON.parse)
      .should(
        spok({
          present: spok.string,
        }),
      )
      .its("present")
      .apply(JSON.parse)
      .its("items")
      .should(
        spok([
          {
            createdAt: timestamp,
            customFields: {},
            description: "Write code description",
            priority: "none",
            status: "not started",
            title: "Write code",
            updatedAt: timestamp,
            id: spok.test(uuidRegex),
          },
          {
            createdAt: timestamp,
            customFields: {},
            description: "Write tests description",
            priority: "none",
            status: "not started",
            title: "Write tests",
            updatedAt: timestamp,
            id: spok.test(uuidRegex),
          },
        ]),
      )
  })
})
