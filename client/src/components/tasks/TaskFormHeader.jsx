const TaskFormHeader = () => {
  return (
    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">

      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
        Create New Task
      </h2>

      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
        Fill in the details below to organize your workflow.
      </p>

    </div>
  );
};

export default TaskFormHeader;