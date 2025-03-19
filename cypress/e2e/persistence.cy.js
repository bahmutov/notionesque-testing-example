import spok from "cy-spok"

describe("App persistence", () => {
  beforeEach(() => {
    cy.CDP("Network.setCacheDisabled", {
      cacheDisabled: false,
    })
  })

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

    cy.reload()
    cy.get('[data-cy="task-row"]').should("have.length", 2)
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

  it("persists the tasks (control uuid generation)", () => {
    cy.CDP("Network.setCacheDisabled", {
      cacheDisabled: true,
    })

    cy.step("Create 2 tasks")
    // control the clock so we know the timestamps
    const timestamp = "2023-01-01T00:00:00.000Z"
    const started = new Date(timestamp)
    cy.clock(started, ["Date"])

    cy.intercept(
      {
        method: "GET",
        pathname: "uuid.js",
      },
      req => {
        req.continue(res => {
          res.body = res.body.replace(
            "function v4(options, buf, offset) {",
            `
              const uuids = [
                '12345678-1234-1234-1234-000000000001',
                '12345678-1234-1234-1234-000000000002',
                '12345678-1234-1234-1234-000000000003'
              ];
              function v4(options, buf, offset) { return uuids.shift();
            `,
          )
        })
      },
    ).as("uuid")
    cy.home()
    cy.wait("@uuid")

    cy.addTask("Write code", "Write code description")
    cy.addTask("Write tests", "Write tests description")

    cy.step("Check the known items in the local storage")
    cy.window()
      .its("localStorage")
      .invoke("getItem", "persist:tasks")
      .apply(JSON.parse)
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
            id: "12345678-1234-1234-1234-000000000001",
          },
          {
            createdAt: timestamp,
            customFields: {},
            description: "Write tests description",
            priority: "none",
            status: "not started",
            title: "Write tests",
            updatedAt: timestamp,
            id: "12345678-1234-1234-1234-000000000002",
          },
        ]),
      )
  })

  it("loads the state from local storage", () => {
    cy.step('Set the local storage "persist:tasks"')
    cy.fixture("3-tasks.json").then(tasks => {
      cy.window()
        .its("localStorage")
        .invoke(
          "setItem",
          "persist:tasks",
          JSON.stringify({
            present: JSON.stringify({ items: tasks }),
          }),
        )
      cy.home(false)
      cy.section("Check shown items")
      cy.get('[data-cy="task-row"]').should("have.length", tasks.length)
      tasks.forEach((task, k) => {
        cy.step(`Check task ${k + 1}`)
        cy.get('[data-cy="task-row"]')
          .eq(k)
          .within(() => {
            cy.get('[data-cy="task-title"]').should("have.text", task.title)
            cy.get('[data-cy="task-description"]').should(
              "have.text",
              task.description,
            )
            cy.get('[data-cy="task-status"]').should("have.text", task.status)
            cy.get('[data-cy="task-priority"]').should(
              "have.text",
              task.priority,
            )
          })
      })
    })
  })
})
