import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  return {
    formData,
    loading,
    error,

    handleChange,
    createTask,
  };
};

export default useTaskForm;