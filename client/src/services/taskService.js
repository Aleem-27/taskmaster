import apiClient from './apiClient';

const taskService = {
  // User endpoints
  getAll: () =>
    apiClient.get('/tasks'),

  getById: (id) =>
    apiClient.get(`/tasks/${id}`),

  getStats: () =>
    apiClient.get('/tasks/stats'),

  create: (taskData) =>
    apiClient.post('/tasks', taskData),

  update: (id, taskData) =>
    apiClient.put(`/tasks/${id}`, taskData),

  delete: (id) =>
    apiClient.delete(`/tasks/${id}`),

  // Admin endpoints
  admin: {
    getAllTasks: () =>
      apiClient.get('/tasks/admin/all'),

    getStats: () =>
      apiClient.get('/tasks/admin/stats'),

    deleteTask: (id) =>
      apiClient.delete(`/tasks/admin/${id}`),
  },
};

export default taskService;