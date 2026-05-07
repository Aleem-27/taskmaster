import StatCard from '../components/dashboard/StatCard';
import SkeletonCard from '../components/dashboard/SkeletonCard';
import useDashboard from '../hooks/useDashboard';

const Dashboard = () => {
  const { stats, loading, error } = useDashboard();

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-300 mb-6">
        Overview
      </h2>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Completed Tasks"
              count={stats.completed}
              colorClass="text-emerald-600"
            />

            <StatCard
              title="In Progress"
              count={stats.inProgress}
              colorClass="text-blue-600"
            />

            <StatCard
              title="Pending"
              count={stats.pending}
              colorClass="text-amber-600"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;