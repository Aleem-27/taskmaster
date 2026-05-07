import { useEffect, useMemo, useState } from 'react';
import taskService from '../services/taskService';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to fetch tasks'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'All Statuses' ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'All Priorities' ||
        task.priority === priorityFilter;

      return matchesStatus && matchesPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  return {
    tasks: filteredTasks,
    loading,
    error,

    statusFilter,
    priorityFilter,

    setStatusFilter,
    setPriorityFilter,

    refreshTasks: fetchTasks,
  };
};

export default useTasks;