declare namespace Cypress {
  type priority = "None" | "Low" | "Medium" | "High" | "Urgent"
  type status = "Not Started" | "In Progress" | "Completed"

  interface TaskDetails {
    title: string
    description?: string
    priority?: "none" | "low" | "medium" | "high" | "urgent"
    status?: "not started" | "in progress" | "completed"
  }

  interface Chainable {
    /**
     * Go to the homepage and check the elements.
     * @param zeroTasks - If true, check for zero tasks.
     * @example cy.home()
     * @example cy.home(true) // visit the homepage and check if there are zero tasks
     */
    home(zeroTasks?: boolean): Chainable<void>

    /**
     * Add a single task.
     * @param title - The title of the task.
     * @param description - The description of the task.
     * @param priority - The priority of the task (optional).
     * @param status - The status of the task (optional).
     * @example cy.addTask("Test Task", "Test Task Description")
     * @example cy.addTask("Test Task", "Test Task Description", "High")
     * @example cy.addTask("Test Task", "Test Task Description", "High", "In Progress")
     */
    addTask(
      title: string,
      description: string,
      priority?: priority,
      status?: status,
    ): Chainable<void>

    /**
     * Add multiple tasks very quickly by calling the Redux actions.
     * @param tasks - An array of task objects. Each object should at least have
     * a `title` and a `description` property and `description` strings.
     * @example
     * cy.home()
     * cy.addTasks([
     *   { title: "Test Task 1", description: "Test Task Description 1" },
     *   { title: "Test Task 2", description: "Test Task Description 2" },
     *   { title: "Test Task 3", description: "Test Task Description 3" },
     * ])
     */
    addTasks(tasks: TaskDetails[]): Chainable<void>

    //
    // component testing
    //

    /**
     * Mount a component with the Redux store.
     * @param component - The component to mount.
     * @example cy.mount(<Component />)
     */
    mount(component: React.ReactNode): Chainable<void>
  }
}
