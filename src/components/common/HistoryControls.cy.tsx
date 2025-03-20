/// <reference types="cypress" />
/// <reference path="../../../cypress/support/index.d.ts" />

import React from "react"
import HistoryControls from "./HistoryControls"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "../../app/store"
import { addTask, deleteAllTasks } from "../../features/tasks/tasksSlice"
import "../../index.css"

describe("<HistoryControls />", () => {
  beforeEach(() => {
    // because we are using a shared store, we need to clear the store
    store.dispatch(deleteAllTasks())
  })

  it("renders the default buttons", () => {
    cy.mount(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HistoryControls />
        </PersistGate>
      </Provider>,
    )
    cy.wait(150)
    cy.get('[data-testid="undo-button"]').should("be.disabled")
    cy.get('[data-testid="redo-button"]').should("be.disabled")
  })

  it("enables the undo when there is even one action in history", () => {
    cy.mount(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HistoryControls />
        </PersistGate>
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

    cy.wrap(store)
      .invoke("getState")
      .its("tasks.present.items")
      .should("have.length", 1)
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
    cy.wrap(store)
      .invoke("getState")
      .its("tasks.present.items")
      .should("have.length", 0)
  })
})
