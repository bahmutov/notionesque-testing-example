/**
 * Selectors to be used when querying elements on the web page.
 * @example
 *  cy.get(Selectors.taskModal.form)
 *    .within(() => { ... })
 */
export const Selectors = {
  taskModal: {
    form: '[data-cy="task-form"]',
    title: '[name="title"]',
    description: '[name="description"]',
    toggleCustomFields: '[data-cy="toggle-custom-fields"]',
    createButton: 'button:contains("Create")',
    updateButton: 'button:contains("Update")',
  },
  filters: {
    search: '[data-cy="search-input"]',
    status: '[data-cy="search-status-filter"]',
    priority: '[data-cy="search-priority-filter"]',
  },
  task: {
    row: '[data-cy="task-row"]',
    title: '[data-cy="task-title"]',
    status: '[data-cy="task-status"]',
    priority: '[data-cy="task-priority"]',
  },
  zeroTasks: '[data-cy="zero-tasks"]',
  customFields: {
    container: '[data-cy="custom-fields"]',
    addField: '[data-cy="add-custom-field"]',
    newFieldName: '[data-cy="new-custom-field-name"]',
    newFieldValue: '[data-cy="new-custom-field-value"]',
    addFieldButton: 'button:contains("Add Field")',
    field: '[data-cy="custom-field"]',
    deleteButton: 'button:contains("Delete")',
  },
  kanban: {
    card: '[data-cy="kanban-card"]',
    viewButton: 'button:contains("Kanban")',
    editButton: 'button:contains("Edit")',
  },
}
