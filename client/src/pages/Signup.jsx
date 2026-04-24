import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-zinc-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-full mb-4">
            <UserPlus className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">Get Started</h2>
          <p className="text-zinc-500 mt-2">Create your TaskMaster account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="John Doe"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="name@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
              required 
            />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-4 transition-colors shadow-lg shadow-emerald-200">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;