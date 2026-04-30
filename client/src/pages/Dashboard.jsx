import axios from 'axios';
import taskService from '../services/taskService';
import { useEffect, useState } from 'react';

const StatCard = ({ title, count, colorClass }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-xl border border-zinc-200 shadow-sm transition-colors duration-300">
      <p className="text-zinc-500 dark:text-zinc-300 text-sm font-medium transition-colors duration-300">{title}</p>
      <h3 className={`text-3xl font-bold mt-2 ${colorClass}`}>{count}</h3>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-xl border border-zinc-200 shadow-sm animate-pulse">
    <div className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700 rounded mb-4"></div>
    <div className="h-8 w-16 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await taskService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-300 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Completed Tasks" count={stats?.completed || 0} colorClass="text-emerald-600" />
            <StatCard title="In Progress" count={stats?.inProgress || 0} colorClass="text-blue-600" />
            <StatCard title="Pending" count={stats?.pending || 0} colorClass="text-amber-600" />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;