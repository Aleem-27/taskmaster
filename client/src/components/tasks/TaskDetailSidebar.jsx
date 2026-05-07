import {
  Calendar,
  Flag,
  CheckCircle2,
} from 'lucide-react';

const TaskDetailSidebar = ({ task }) => {
  return (
    <div className="space-y-6 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">

      <div className="flex items-center gap-3">
        <CheckCircle2
          className="text-emerald-500 dark:text-emerald-400"
          size={20}
        />

        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Status
          </p>

          <p className="font-semibold text-zinc-800 dark:text-zinc-300">
            {task.status}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Calendar
          className="text-blue-500 dark:text-blue-400"
          size={20}
        />

        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Due Date
          </p>

          <p className="font-semibold text-zinc-800 dark:text-zinc-300">
            {task.dueDate?.slice(0, 10)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Flag
          className="text-zinc-400 dark:text-zinc-300"
          size={20}
        />

        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Created At
          </p>

          <p className="font-semibold text-zinc-800 dark:text-zinc-300">
            {task.createdAt?.slice(0, 10)}
          </p>
        </div>
      </div>

    </div>
  );
};

export default TaskDetailSidebar;