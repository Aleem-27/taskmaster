const StatCard = ({ title, count, colorClass }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-xl border border-zinc-200 shadow-sm transition-colors duration-300">
      <p className="text-zinc-500 dark:text-zinc-300 text-sm font-medium transition-colors duration-300">{title}</p>
      <h3 className={`text-3xl font-bold mt-2 ${colorClass}`}>{count}</h3>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-300 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Completed Tasks" count={12} colorClass="text-emerald-600" />
        <StatCard title="In Progress" count={5} colorClass="text-blue-600" />
        <StatCard title="Pending" count={3} colorClass="text-amber-600" />
      </div>
    </div>
  );
};

export default Dashboard;