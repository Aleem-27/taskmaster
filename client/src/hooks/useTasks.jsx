import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
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

  const updateTaskStatus = async (task, newStatus) => {
    try {
      await taskService.update(task.id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
        dueDate: task.dueDate,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );

      toast.success(`Task marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update task status');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'All Statuses' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'All Priorities' || task.priority === priorityFilter;
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
    updateTaskStatus,
    deleteTask,
  };
};

export default useTasks;