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
  Filters: {
    Search: '[data-cy="search-input"]',
    Status: '[data-cy="search-status-filter"]',
    Priority: '[data-cy="search-priority-filter"]',
  },
  Task: {
    Row: '[data-cy="task-row"]',
    Title: '[data-cy="task-title"]',
    Status: '[data-cy="task-status"]',
    Priority: '[data-cy="task-priority"]',
  },
  ZeroTasks: '[data-cy="zero-tasks"]',
}
