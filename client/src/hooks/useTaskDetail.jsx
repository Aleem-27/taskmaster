import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import taskService from '../services/taskService';

const useTaskDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await taskService.getById(id);

      setTask(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to fetch task'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const deleteTask = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) return;

    try {
      await taskService.delete(id);

      toast.success('Task deleted successfully');

      navigate('/tasks');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to delete task'
      );
    }
  };

  return {
    task,
    loading,
    error,

    deleteTask,
  };
};

export default useTaskDetail;