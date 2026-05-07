const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-xl border border-zinc-200 shadow-sm animate-pulse">
      <div className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700 rounded mb-4"></div>
      <div className="h-8 w-16 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
    </div>
  );
};

export default SkeletonCard;