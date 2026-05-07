export const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

    case 'Medium':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';

    case 'Low':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';

    default:
      return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
  }
};