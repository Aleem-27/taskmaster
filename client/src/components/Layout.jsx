import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, User, LogOut, CheckCircle } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-300 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <CheckCircle size={24} /> TaskMaster
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition
              ${isActive
                ? 'bg-emerald-100 text-emerald-600 font-medium'
                : 'text-zinc-700 hover:bg-emerald-50 hover:text-emerald-600'
              }`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition
              ${isActive
                ? 'bg-emerald-100 text-emerald-600 font-medium'
                : 'text-zinc-700 hover:bg-emerald-50 hover:text-emerald-600'
              }`
            }
          >
            <ClipboardList size={20} /> My Tasks
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition
              ${isActive
                ? 'bg-emerald-100 text-emerald-600 font-medium'
                : 'text-zinc-700 hover:bg-emerald-50 hover:text-emerald-600'
              }`
            }
          >
            <User size={20} /> Profile
          </NavLink>
        </nav>

        <div className="p-4 border-t border-zinc-300">
          <button className="cursor-pointer flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-zinc-300 flex items-center justify-end px-8">
          <span className="text-md font-medium text-zinc-600">
            Welcome, User
          </span>
        </header>

        <div className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>

        <footer className="h-14 bg-white border-t border-zinc-300 flex items-center justify-center text-sm text-zinc-500">
          © {new Date().getFullYear()} TaskMaster • Built by{" "}
          <a
            href="https://github.com/Aleem-27"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline ml-1"
          >
            Aleem
          </a>
        </footer>
      </main>
    </div>
  );
};

export default Layout;