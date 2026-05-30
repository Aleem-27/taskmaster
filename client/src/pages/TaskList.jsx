import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useTasks from '../hooks/useTasks';
import TaskRow from '../components/tasks/TaskListRow';
import TaskFilters from '../components/tasks/TaskListFilters';
import TaskSkeletonRow from '../components/tasks/TaskListSkeletonRow';

const TaskList = () => {
  const {
    tasks,
    loading,
    error,
    statusFilter,
    priorityFilter,
    setStatusFilter,
    setPriorityFilter,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            My Tasks
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Manage and track your daily productivity
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-300"
        >
          <Plus size={20} />
          New Task
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        setStatusFilter={setStatusFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-150">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold">Task Name</th>
                <th className="px-6 py-4 text-xs font-semibold">Status</th>
                <th className="px-6 py-4 text-xs font-semibold">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold">Due Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <>
                  <TaskSkeletonRow />
                  <TaskSkeletonRow />
                  <TaskSkeletonRow />
                </>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-zinc-500">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onStatusChange={updateTaskStatus}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;