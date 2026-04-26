import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend logic for authentication 
    console.log("Login attempted");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4 transition-colors duration-300">
            <LogIn className="text-emerald-600 dark:text-emerald-400" size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100">Welcome Back</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Log in to manage your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              placeholder="name@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200 dark:shadow-none cursor-pointer">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-600 dark:text-zinc-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-600 dark:text-emerald-500 font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;