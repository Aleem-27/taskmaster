const TaskFormFields = ({ formData, handleChange, isEditMode }) => {
  return (
    <>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Task Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g., Complete Database Migration"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Describe the task details..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-colors duration-300"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            required
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-colors duration-300"
          />
        </div>

        {/* Status — only shown when editing */}
        {isEditMode && (
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-colors duration-300"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

      </div>
    </>
  );
};

export default TaskFormFields;