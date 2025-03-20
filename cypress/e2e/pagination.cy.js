describe("App List View", () => {
  beforeEach(() => {
    // disable network caching to download the real uuid.js
    // script otherwise the "persistence.cy.js" will use the
    // intercepted faked version with just a few uuids
    cy.CDP("Network.setCacheDisabled", {
      cacheDisabled: true,
    })
  })

  beforeEach(() => {
    cy.home()

    const n = 60
    cy.step(`Create ${n} tasks really quickly`)
    for (let i = 1; i <= n; i++) {
      cy.window({ log: false })
        .its("store", { log: false })
        .invoke({ log: false }, "dispatch", {
          type: "tasks/addTask",
          payload: {
            title: `Test Task ${i}`,
            description: `Test Task Description ${i}`,
          },
        })
    }
    cy.log("All task ids are distinct")
    cy.window({ log: false })
      .its("store", { log: false })
      .invoke("getState")
      .its("tasks.present.items")
      .map("id")
      .should("be.unique")
  })

  it("shows paginated tasks", () => {
    cy.step("Check the pagination")
    cy.get('[data-cy="task-row"]').should("have.length", 10)
    cy.get("[data-cy=desktop-pagination]")
      .find('[data-cy="pagination-info"]')
      .should("have.text", "Showing 1 to 10 of 60 results")
    cy.get('[aria-label="Pagination"]')
      .should("be.visible")
      .within(() => {
        cy.contains("button", "First").should("be.disabled")
        cy.contains("button", "Prev").should("be.disabled")
        cy.contains("button", "1").should("have.attr", "data-is-active", "true")
        cy.contains("button", "2").should(
          "have.attr",
          "data-is-active",
          "false",
        )

        cy.step("Go to the next page")
        cy.contains("button", "Next").click()
        cy.contains("button", "First").should("be.enabled")
        cy.contains("button", "Prev").should("be.enabled")
        cy.contains("button", "1").should(
          "have.attr",
          "data-is-active",
          "false",
        )
        cy.contains("button", "2").should("have.attr", "data-is-active", "true")
      })

    cy.get("[data-cy=desktop-pagination]")
      .find('[data-cy="pagination-info"]')
      .should("have.text", "Showing 11 to 20 of 60 results")

    cy.step("Go to the last page")
    cy.get('[aria-label="Pagination"]')
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Last").click()
        cy.contains("button", "Next").should("be.disabled")
        cy.contains("button", "Last").should("be.disabled")
        cy.contains("button", "5").should(
          "have.attr",
          "data-is-active",
          "false",
        )
        cy.contains("button", "6").should("have.attr", "data-is-active", "true")
      })
    cy.get("[data-cy=desktop-pagination]")
      .find('[data-cy="pagination-info"]')
      .should("have.text", "Showing 51 to 60 of 60 results")

    cy.step("Select visible tasks")
    cy.get('[data-cy="select-all"]').check()
    cy.get('[data-cy="selected-tasks"]').should(
      "have.text",
      "10 tasks selected",
    )
    cy.contains("button", "Delete Selected").click()

    cy.step("🚨 Problematic action")
    // we probable want to reset the pagination instead
    cy.get('[data-cy="zero-tasks"]').should("be.visible")
    cy.get("[data-cy=desktop-pagination]")
      .find('[data-cy="pagination-info"]')
      .should("have.text", "Showing 51 to 50 of 50 results")

    cy.step("Go to the 3rd page")
    cy.get('[aria-label="Pagination"]').contains("button", "3").click()
    cy.get("[data-cy=desktop-pagination]")
      .find('[data-cy="pagination-info"]')
      .should("have.text", "Showing 21 to 30 of 50 results")
    cy.get('[aria-label="Pagination"]')
      .should("be.visible")
      .within(() => {
        cy.contains("button", "3").should("have.attr", "data-is-active", "true")
      })
  })

  it(
    "shows paginated tasks on mobile",
    { viewportWidth: 300, viewportHeight: 500 },
    () => {
      cy.step("Check the pagination")
      cy.get('[data-cy="desktop-pagination"]').should("not.be.visible")
      cy.get('[data-cy="mobile-pagination"]')
        .scrollIntoView()
        .should("be.visible")
        .within(() => {
          cy.contains("button", "Previous").should("be.disabled")
          cy.get('[data-cy="pagination-info"]').should(
            "have.text",
            "Page 1 of 6",
          )
          cy.contains("button", "Next").should("be.enabled")
        })

      cy.step("Go to the next page")
      cy.get('[data-cy="mobile-pagination"]').contains("button", "Next").click()
      cy.get('[data-cy="mobile-pagination"]').within(() => {
        cy.contains("button", "Previous").should("be.enabled")
        cy.get('[data-cy="pagination-info"]').should("have.text", "Page 2 of 6")
        cy.contains("button", "Next").should("be.enabled")
      })

      cy.step("Go to the prev page")
      cy.get('[data-cy="mobile-pagination"]').contains("button", "Prev").click()
      cy.get('[data-cy="mobile-pagination"]').within(() => {
        cy.contains("button", "Previous").should("be.disabled")
        cy.get('[data-cy="pagination-info"]').should("have.text", "Page 1 of 6")
        cy.contains("button", "Next").should("be.enabled")
      })
    },
  )

  it("Selects and deselects the paginated tasks", () => {
    cy.step("Select the 3rd page")
    cy.get('[data-cy="desktop-pagination"]').contains("button", "3").click()
    cy.get("[data-cy=desktop-pagination]")
      .find('[data-cy="pagination-info"]')
      .should("have.text", "Showing 21 to 30 of 60 results")

    cy.step("Select all")
    cy.get('[data-cy="select-all"]').check()
    cy.get('[data-cy="selected-tasks"]').should(
      "have.text",
      "10 tasks selected",
    )

    cy.step("Deselect all")
    cy.get('[data-cy="select-all"]').uncheck()
    cy.get('[data-cy="selected-tasks"]').should("not.exist")
  })
})
