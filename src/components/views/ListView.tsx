//src/components/views/ListView.tsx
import React, { useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { openTaskModal, setSortConfig } from "../../features/ui/uiSlice"
import { deleteTask, deleteTasks } from "../../features/tasks/tasksSlice"
import {
  Task,
  SortField,
  SortDirection,
  TaskStatus,
  TaskPriority,
} from "../../types"

const ListView: React.FC = () => {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(state => state.tasks.present.items as Task[])
  const filterConfig = useAppSelector(state => state.ui.filterConfig)
  const sortConfig = useAppSelector(state => state.ui.sortConfig)

  // State for selected tasks (for bulk actions)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 10

  // Filter and sort tasks based on current configuration
  const filteredAndSortedTasks = React.useMemo(() => {
    // First, filter the tasks
    let result = tasks.filter(task => {
      // Filter by status
      if (
        filterConfig.status !== "all" &&
        task.status !== filterConfig.status
      ) {
        return false
      }

      // Filter by priority
      if (
        filterConfig.priority !== "all" &&
        task.priority !== filterConfig.priority
      ) {
        return false
      }

      // Filter by search term
      if (
        filterConfig.searchTerm &&
        !task.title
          .toLowerCase()
          .includes(filterConfig.searchTerm.toLowerCase())
      ) {
        return false
      }

      return true
    })

    // Then, sort the filtered tasks
    result.sort((a, b) => {
      const { field, direction } = sortConfig
      const multiplier = direction === "asc" ? 1 : -1

      // Handle date fields
      if (field === "createdAt" || field === "updatedAt") {
        return (
          multiplier *
          (new Date(a[field]).getTime() - new Date(b[field]).getTime())
        )
      }

      // Handle string fields
      if (typeof a[field] === "string" && typeof b[field] === "string") {
        return multiplier * a[field].localeCompare(b[field] as string)
      }

      return 0
    })

    return result
  }, [tasks, filterConfig, sortConfig])

  // Get paginated tasks
  const paginatedTasks = React.useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage
    return filteredAndSortedTasks.slice(startIndex, startIndex + tasksPerPage)
  }, [filteredAndSortedTasks, currentPage, tasksPerPage])

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedTasks.length / tasksPerPage)

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortConfig.field === field) {
      // Toggle direction if same field
      const newDirection: SortDirection =
        sortConfig.direction === "asc" ? "desc" : "asc"
      dispatch(setSortConfig({ field, direction: newDirection }))
    } else {
      // Set new field with default descending
      dispatch(setSortConfig({ field, direction: "desc" }))
    }
  }

  // Get sort direction indicator
  const getSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) return null
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  // Handle edit task
  const handleEditTask = (task: Task) => {
    dispatch(openTaskModal(task.id))
  }

  // Handle delete task
  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id))
      // Remove from selection if it was selected
      if (selectedTaskIds.has(id)) {
        const newSelection = new Set(selectedTaskIds)
        newSelection.delete(id)
        setSelectedTaskIds(newSelection)
      }
    }
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedTaskIds.size === 0) return

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTaskIds.size} tasks?`,
      )
    ) {
      dispatch(deleteTasks(Array.from(selectedTaskIds)))
      setSelectedTaskIds(new Set())
    }
  }

  // Toggle task selection
  const toggleTaskSelection = (id: string) => {
    const newSelection = new Set(selectedTaskIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedTaskIds(newSelection)
  }

  // Toggle all selection
  const toggleSelectAll = () => {
    if (selectedTaskIds.size === paginatedTasks.length) {
      // Deselect all
      setSelectedTaskIds(new Set())
    } else {
      // Select all
      const newSelection = new Set<string>()
      paginatedTasks.forEach(task => newSelection.add(task.id))
      setSelectedTaskIds(newSelection)
    }
  }

  // Style classes for status badges
  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Style classes for priority badges
  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Pagination navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div
      className="bg-white shadow rounded-lg overflow-hidden"
      data-cy="list-view"
    >
      {/* Bulk actions bar */}
      {selectedTaskIds.size > 0 && (
        <div className="bg-blue-50 px-4 py-2 flex items-center justify-between border-b">
          <span
            className="text-sm text-blue-700 font-medium"
            data-cy="selected-tasks"
          >
            {selectedTaskIds.size}{" "}
            {selectedTaskIds.size === 1 ? "task" : "tasks"} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Task table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    paginatedTasks.length > 0 &&
                    selectedTaskIds.size === paginatedTasks.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  data-cy="select-all"
                  disabled={filteredAndSortedTasks.length === 0}
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
                data-cy="task-title-header"
              >
                Title {getSortIndicator("title")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
                data-cy="task-status-header"
              >
                Status {getSortIndicator("status")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("priority")}
                data-cy="task-priority-header"
              >
                Priority {getSortIndicator("priority")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("updatedAt")}
                data-cy="task-updated-header"
              >
                Updated {getSortIndicator("updatedAt")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200" data-cy="tasks">
            {paginatedTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50" data-cy="task-row">
                <td className="px-3 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.has(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    data-cy="select-task"
                  />
                </td>
                <td className="px-6 py-4">
                  <div
                    className="text-sm font-medium text-gray-900"
                    data-cy="task-title"
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div
                      className="text-sm text-gray-500 truncate max-w-xs"
                      data-cy="task-description"
                    >
                      {task.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}
                    data-cy="task-status"
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}
                    data-cy="task-priority"
                  >
                    {task.priority}
                  </span>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  data-cy="task-updated"
                  data-updated-at={task.updatedAt}
                >
                  {formatDate(task.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginatedTasks.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                  data-cy="zero-tasks"
                >
                  No tasks found. Create a new task to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div
            className="flex-1 flex justify-between sm:hidden"
            data-cy="mobile-pagination"
          >
            {/* Mobile pagination */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <span
              className="text-sm text-gray-700 ml-1"
              data-cy="pagination-info"
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>

          {/* Desktop pagination */}
          <div
            className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            data-cy="desktop-pagination"
          >
            <div>
              <p className="text-sm text-gray-700" data-cy="pagination-info">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * tasksPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * tasksPerPage,
                    filteredAndSortedTasks.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredAndSortedTasks.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Prev
                </button>

                {/* Page numbers - show current page and adjacent pages */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Center around current page
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      data-is-active={currentPage === pageNum}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Last
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListView
