import { useState, useEffect } from 'react';
import { adminService, taskService } from '../services';

const useAdmin = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [taskFilters, setTaskFilters] = useState({
    status: '',
    priority: '',
  });

  const [userFilters, setUserFilters] = useState({
    role: '',
  });

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, tasksRes, statsRes] = await Promise.all([
        adminService.getAllUsers(),
        taskService.admin.getAllTasks(),
        taskService.admin.getStats(),
      ]);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch {
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    await adminService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const updateUserRole = async (id, role) => {
    await adminService.updateUserRole(id, role);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const deleteTask = async (id) => {
    await taskService.admin.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Client-side filtering — no extra API calls needed
  const filteredTasks = tasks.filter((t) => {
    const statusMatch = !taskFilters.status || t.status === taskFilters.status;
    const priorityMatch = !taskFilters.priority || t.priority === taskFilters.priority;
    return statusMatch && priorityMatch;
  });

  const filteredUsers = users.filter((u) => {
    return !userFilters.role || u.role === userFilters.role;
  });

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    users: filteredUsers,
    tasks: filteredTasks,
    stats,
    loading,
    error,
    taskFilters,
    setTaskFilters,
    userFilters,
    setUserFilters,
    deleteUser,
    updateUserRole,
    deleteTask,
  };
};

export default useAdmin;