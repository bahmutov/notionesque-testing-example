/// <reference types="cypress" />
/// <reference types="cypress-plugin-steps" />
/// <reference path="../../../cypress/support/index.d.ts" />

import React from "react"
import TaskModal from "./TaskModal"
import { Provider } from "react-redux"
import { store } from "../../app/store"
import "../../index.css"
import { openTaskModal } from "../../features/ui/uiSlice"
import spok from "cy-spok"

describe("<TaskModal />", { viewportHeight: 700, viewportWidth: 700 }, () => {
  it("adds a new task", () => {
    cy.mount(
      <Provider store={store}>
        <TaskModal />
      </Provider>,
    )

    cy.spy(store, "dispatch")
      // we are only interested in the "add task" action
      .withArgs({
        type: "tasks/addTask",
        payload: Cypress.sinon.match.object,
      })
      .as("addTask")

    cy.step("Open the task modal")
    const taskId = "1"
    cy.wrap(store).invoke("dispatch", openTaskModal(taskId))

    cy.get('[data-cy="task-form"]')
      .should("be.visible")
      .within(() => {
        cy.get('[name="title"]')
          .should("be.visible")
          .and("be.empty")
          .type("Test Task")

        cy.contains("button", "Create").click()
      })

    cy.get('[data-cy="task-form"]').should("not.exist")
    cy.step("Confirm the Redux action payload")
    cy.get("@addTask")
      .should("have.been.calledOnce")
      .its("args[0][0]")
      .should(
        spok({
          type: "tasks/addTask",
          payload: {
            customFields: {},
            description: "",
            priority: "none",
            status: "not started",
            title: "Test Task",
          },
        }),
      )
  })
})
