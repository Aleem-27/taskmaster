import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import taskService from '../services/taskService';

const initialState = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
};

const useTaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [fetchingTask, setFetchingTask] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Prefill form when editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchTask = async () => {
      try {
        const response = await taskService.getById(id);
        const task = response.data;

        setFormData({
          title: task.title ?? '',
          description: task.description ?? '',
          priority: task.priority ?? 'Medium',
          status: task.status ?? 'Pending',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
      } catch {
        setError('Failed to load task. Please go back and try again.');
      } finally {
        setFetchingTask(false);
      }
    };

    fetchTask();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await taskService.create(formData);
      toast.success('Task created successfully');
      navigate('/tasks');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to create task'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await taskService.update(id, formData);
      toast.success('Task updated successfully');
      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to update task'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    fetchingTask,
    error,
    isEditMode,
    handleChange,
    createTask,
    updateTask,
  };
};

export default useTaskForm;