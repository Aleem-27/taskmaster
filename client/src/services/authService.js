import apiClient from './apiClient';

const authService = {
  register: (fullName, username, password) =>
    apiClient.post('/auth/register', { fullName, username, password }),

  login: (username, password) =>
    apiClient.post('/auth/login', { username, password }),

  logout: () =>
    apiClient.post('/auth/logout'),

  getProfile: () =>
    apiClient.get('/auth/profile'),
};

export default authService;