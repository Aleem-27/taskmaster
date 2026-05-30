import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import Profile from './pages/Profile';
import TaskDetail from './pages/TaskDetail';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        theme={document.documentElement.classList.contains('dark') ? "dark" : "light"}
        autoClose={3000}
        position="bottom-center"
        toastStyle={{
          backgroundColor: document.documentElement.classList.contains('dark')
            ? "#1e1e1e"
            : "#ffffff",
          color: document.documentElement.classList.contains('dark')
            ? "#ffffff"
            : "#111111",
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/edit/:id" element={<TaskForm />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;