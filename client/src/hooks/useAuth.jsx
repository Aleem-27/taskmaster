import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

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
      toast.success("You've registered successfully! Log in to your account now.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Logout failed');
    } finally {
      clearSession();
      setLoading(false);
      navigate('/login');
    }
  };

  return { login, signup, logout, loading, error };
};

export default useAuth;