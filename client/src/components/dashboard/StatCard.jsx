const StatCard = ({ title, count, colorClass }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-xl border border-zinc-200 shadow-sm transition-colors duration-300">
      <p className="text-zinc-500 dark:text-zinc-300 text-sm font-medium">
        {title}
      </p>

      <h3 className={`text-3xl font-bold mt-2 ${colorClass}`}>
        {count}
      </h3>
    </div>
  );
};

export default StatCard;