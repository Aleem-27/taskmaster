const TaskSkeletonRow = () => {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5].map((item) => (
        <td key={item} className="px-6 py-4">
          <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
        </td>
      ))}
    </tr>
  );
};

export default TaskSkeletonRow;