import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { getPriorityStyle, getStatusIcon } from './TaskListUtils';

const TaskRow = ({ task }) => {
  return (
    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors duration-300">
      <td className="px-6 py-4">
        <Link
          to={`/tasks/${task.id}`}
          className="font-medium text-xs sm:text-base text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
        >
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
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityStyle(task.priority)}`}
        >
          {task.priority}
        </span>
      </td>

      <td className="px-6 py-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        {task.dueDate.replace('T', ' ').slice(0, 16)}
      </td>

      <td className="px-6 py-4 text-right">
        <button className="cursor-pointer text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300">
          <MoreHorizontal size={20} />
        </button>
      </td>
    </tr>
  );
};

export default TaskRow;