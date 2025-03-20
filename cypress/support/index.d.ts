declare namespace Cypress {
  type priority = "None" | "Low" | "Medium" | "High" | "Urgent"
  type status = "Not Started" | "In Progress" | "Completed"

  interface Chainable {
    /**
     * Go to the homepage and check the elements.
     * @param zeroTasks - If true, check for zero tasks.
     */
    home(zeroTasks?: boolean): Chainable<void>

    /**
     * Add a single task.
     * @param title - The title of the task.
     * @param description - The description of the task.
     * @param priority - The priority of the task (optional).
     * @param status - The status of the task (optional).
     */
    addTask(
      title: string,
      description: string,
      priority?: priority,
      status?: status,
    ): Chainable<void>

    /**
     * Add multiple tasks.
     * @param tasks - An array of task objects. Each object should at least have
     * a `title` and a `description` property and `description` strings.
     */
    addTasks(tasks: unknown[]): Chainable<void>
  }
}
