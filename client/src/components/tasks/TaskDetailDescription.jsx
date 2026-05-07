const TaskDescription = ({ description }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-2">
        Description
      </h3>

      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default TaskDescription;