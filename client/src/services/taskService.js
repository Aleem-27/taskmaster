import apiClient from './apiClient';

const taskService = {
  getAll: () => apiClient.get('/Tasks'),
  getById: (id) => apiClient.get(`/Tasks/${id}`),
  getStats: () => apiClient.get('/Tasks/Stats'),
  create: (taskData) => apiClient.post('/Tasks', taskData),
  update: (id, taskData) => apiClient.put(`/Tasks/${id}`, taskData),
  delete: (id) => apiClient.delete(`/Tasks/${id}`),
};

export default taskService;