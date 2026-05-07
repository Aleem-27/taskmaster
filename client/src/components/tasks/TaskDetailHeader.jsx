import { Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getPriorityBadge } from './TaskDetailStyles';

const TaskDetailHeader = ({
  task,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">

      <div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityBadge(task.priority)}`}
        >
          {task.priority} Priority
        </span>

        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-300 mt-3">
          {task.title}
        </h1>
      </div>

      <div className="flex gap-2">

        <button
          onClick={() => navigate(`/tasks/edit/${task.id}`)}
          className="p-2 text-zinc-400 dark:text-zinc-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-lg transition-all cursor-pointer"
        >
          <Edit3 size={20} />
        </button>

        <button
          onClick={onDelete}
          className="p-2 text-zinc-400 dark:text-zinc-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-all cursor-pointer"
        >
          <Trash2 size={20} />
        </button>

      </div>
    </div>
  );
};

export default TaskDetailHeader;