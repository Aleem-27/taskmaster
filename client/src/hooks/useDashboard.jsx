import { useEffect, useState } from 'react';
import taskService from '../services/taskService';

const useDashboard = () => {
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await taskService.getStats();
      setStats(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to fetch dashboard stats'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};

export default useDashboard;