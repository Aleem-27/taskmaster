import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, User, LogOut, CheckCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-white border-r border-zinc-300 flex flex-col transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <CheckCircle size={24} /> TaskMaster
          </h1>
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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
      <main className="flex-1 flex flex-col w-full">
        <header className="h-16 bg-white border-b border-zinc-300 flex items-center justify-between px-4 md:px-8">
          <button className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="text-md font-medium text-zinc-600 ml-auto">
            Welcome, User
          </span>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>

        <footer className="h-14 bg-white border-t border-zinc-300 flex items-center justify-center text-xs md:text-sm text-zinc-500 px-4 text-center">
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