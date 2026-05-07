import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useTaskDetail from '../hooks/useTaskDetail';

import TaskDetailHeader from '../components/tasks/TaskDetailHeader';
import TaskDetailDescription from '../components/tasks/TaskDetailDescription';
import TaskDetailSidebar from '../components/tasks/TaskDetailSidebar';
import TaskDetailSkeleton from '../components/tasks/TaskDetailSkeleton';

const TaskDetail = () => {
  const navigate = useNavigate();

  const {
    task,
    loading,
    error,

    deleteTask,
  } = useTaskDetail();

  if (loading) {
    return <TaskDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-400 hover:underline mb-6 transition-colors cursor-pointer"
      >
        <ChevronLeft size={20} />

        Back to List
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">

        <TaskDetailHeader
          task={task}
          onDelete={deleteTask}
        />

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <TaskDetailDescription
              description={task.description}
            />

          </div>

          <TaskDetailSidebar
            task={task}
          />

        </div>
      </div>
    </div>
  );
};

export default TaskDetail;