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
    toggleCustomFields: '[data-cy="toggle-custom-fields"]',
    createButton: 'button:contains("Create")',
    updateButton: 'button:contains("Update")',
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
  CustomFields: {
    container: '[data-cy="custom-fields"]',
    addField: '[data-cy="add-custom-field"]',
    newFieldName: '[data-cy="new-custom-field-name"]',
    newFieldValue: '[data-cy="new-custom-field-value"]',
    addFieldButton: 'button:contains("Add Field")',
    field: '[data-cy="custom-field"]',
    deleteButton: 'button:contains("Delete")',
  },
  Kanban: {
    card: '[data-cy="kanban-card"]',
    viewButton: 'button:contains("Kanban")',
    editButton: 'button:contains("Edit")',
  },
}
