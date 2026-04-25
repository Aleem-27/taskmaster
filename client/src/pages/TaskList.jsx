import { Plus, Filter, MoreHorizontal, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskList = () => {
  // Mock data to visualize the UI
  const tasks = [
    { id: 1, title: 'Fix API Authentication', priority: 'High', status: 'In Progress', dueDate: '2026-04-20' },
    { id: 2, title: 'Design Database Schema', priority: 'Medium', status: 'Completed', dueDate: '2026-04-15' },
    { id: 3, title: 'Setup Serilog Logging', priority: 'Low', status: 'Pending', dueDate: '2026-04-22' },
  ];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Low': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />;
      case 'In Progress': return <Clock size={16} className="text-blue-500 dark:text-blue-400" />;
      default: return <AlertCircle size={16} className="text-zinc-400 dark:text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">My Tasks</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage and track your daily productivity</p>
        </div>
        <Link
          to="/tasks/new"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md shadow-emerald-100 dark:shadow-none"
        >
          <Plus size={20} />
          New Task
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-1 md:gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium mr-2 transition-colors duration-300">
          <Filter size={18} />
          <span>Filter by:</span>
        </div>
        <select className="cursor-pointer bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select className="cursor-pointer bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300">
          <option>All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-600px">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Task Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors duration-300 group">
                  <td className="px-6 py-4">
                    <Link to={`/tasks/${task.id}`} className="font-medium text-xs sm:text-base text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      {getStatusIcon(task.status)}
                      {task.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;