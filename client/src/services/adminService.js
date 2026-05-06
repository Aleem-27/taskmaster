import apiClient from './apiClient';

const adminService = {
  getAllUsers: () =>
    apiClient.get('/admin/users'),

  updateUserRole: (id, role) =>
    apiClient.put(`/admin/users/${id}/role`, { role }),

  deleteUser: (id) =>
    apiClient.delete(`/admin/users/${id}`),
};

export default adminService;