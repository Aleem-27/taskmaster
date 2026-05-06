import axios from 'axios';

const apiClient = axios.create({
  baseURL: "https://localhost:7051/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retrieved this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          'https://localhost:7051/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        // Refresh succeeded - retry the original request
        return apiClient(originalRequest);
      } catch {
        // Refresh failed - session is dead, redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;