/**
 * Selectors to be used when querying elements on the web page.
 * @example
 *  cy.get(Selectors.TaskModal.form)
 *    .within(() => { ... })
 */
export const Selectors = {
  TaskModal: {
    form: '[data-cy="task-form"]',
    title: '[name="title"]',
    description: '[name="description"]',
  },
}
