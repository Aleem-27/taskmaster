import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend logic for authentication 
    console.log("Login attempted");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-zinc-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-full mb-4">
            <LogIn className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">Welcome Back</h2>
          <p className="text-zinc-500 mt-2">Log in to manage your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="name@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-600 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-600 font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;