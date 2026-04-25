import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 transition-colors duration-300 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">
            <UserPlus className="text-emerald-600 dark:text-emerald-400" size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100">Get Started</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Create your TaskMaster account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              placeholder="John Doe"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              placeholder="name@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              placeholder="••••••••"
              required 
            />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-4 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none cursor-pointer">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-600 dark:text-zinc-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 dark:text-emerald-500 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;