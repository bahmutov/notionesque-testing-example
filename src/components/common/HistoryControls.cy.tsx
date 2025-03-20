/// <reference types="cypress" />

import React from "react"
import HistoryControls from "./HistoryControls"
import { Provider } from "react-redux"
import { store } from "../../app/store"
import { addTask } from "../../features/tasks/tasksSlice"
import "../../index.css"
import { ActionCreators } from "redux-undo"

describe("<HistoryControls />", () => {
  beforeEach(() => {
    // because we are using a shared store, we need to clear the history
    localStorage.removeItem("persist:tasks")
    store.dispatch(ActionCreators.clearHistory())
  })

  it("renders the default buttons", () => {
    cy.mount(
      <Provider store={store}>
        <HistoryControls />
      </Provider>,
    )
    cy.get('[data-testid="undo-button"]').should("be.disabled")
    cy.get('[data-testid="redo-button"]').should("be.disabled")
  })

  it.only("enables the undo when there is even one action in history", () => {
    cy.mount(
      <Provider store={store}>
        <HistoryControls />
      </Provider>,
    )
    // wait for the rehydration to complete
    cy.wait(150)
    cy.wrap(store).invoke(
      "dispatch",
      addTask({
        title: "Test Task",
        description: "Test Description",
        status: "not started",
        priority: "none",
        customFields: {},
      }),
    )
    cy.get('[data-testid="undo-button"]').should("be.enabled")
    cy.get('[data-testid="redo-button"]').should("be.disabled")
    cy.log("Checking the internals")
    cy.wrap(store)
      .invoke("getState")
      .its("tasks.past.length")
      .should("equal", 1)
    cy.wrap(store)
      .invoke("getState")
      .its("tasks.future.length")
      .should("equal", 0)
    cy.log("Undo the action")
    cy.get('[data-testid="undo-button"]').click()
    cy.get('[data-testid="undo-button"]').should("be.disabled")
    cy.get('[data-testid="redo-button"]').should("be.enabled")
    cy.wrap(store)
      .invoke("getState")
      .its("tasks.past.length")
      .should("equal", 0)
    cy.wrap(store)
      .invoke("getState")
      .its("tasks.future.length")
      .should("equal", 1)
    // how do we confirm the tasks list?
  })
})
