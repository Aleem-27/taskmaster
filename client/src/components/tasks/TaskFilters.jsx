import { Filter } from 'lucide-react';

const TaskFilters = ({
  statusFilter,
  priorityFilter,
  setStatusFilter,
  setPriorityFilter,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">

      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium mr-2">
        <Filter size={18} />
        <span>Filter by:</span>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="cursor-pointer bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 outline-none"
      >
        <option>All Statuses</option>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="cursor-pointer bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 outline-none"
      >
        <option>All Priorities</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>
  );
};

export default TaskFilters;