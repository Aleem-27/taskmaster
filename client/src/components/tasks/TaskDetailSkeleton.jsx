const TaskDetailSkeleton = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">

      <div className="h-6 w-32 bg-zinc-300 dark:bg-zinc-700 rounded mb-6"></div>

      <div className="h-10 w-2/3 bg-zinc-300 dark:bg-zinc-700 rounded mb-8"></div>

      <div className="space-y-4">
        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
        <div className="h-4 w-5/6 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
      </div>

    </div>
  );
};

export default TaskDetailSkeleton;