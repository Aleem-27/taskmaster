import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { useAuthContext } from '../context/AuthContext';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { saveSession, clearSession } = useAuthContext();
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(username, password);
      const profileRes = await authService.getProfile();
      saveSession(profileRes.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, username, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(fullName, username, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // Always clear session even if the API call fails
      clearSession();
      navigate('/login');
    }
  };

  return { login, signup, logout, loading, error };
};

export default useAuth;