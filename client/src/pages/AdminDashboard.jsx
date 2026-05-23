import { useState } from 'react';
import { Trash2, ShieldCheck, ShieldOff, Users, ClipboardList, Filter } from 'lucide-react';
import useAdmin from '../hooks/useAdmin';

const StatCard = ({ title, count, colorClass }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</p>
    <h3 className={`text-3xl font-bold mt-2 ${colorClass}`}>{count}</h3>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm animate-pulse">
    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-4" />
    <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" /></td>
    <td className="px-4 py-3"><div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" /></td>
    <td className="px-4 py-3"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" /></td>
    <td className="px-4 py-3"><div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" /></td>
    <td className="px-4 py-3"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" /></td>
    <td className="px-4 py-3"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" /></td>
  </tr>
);

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <p className="text-zinc-800 dark:text-zinc-100 font-medium mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const FilterSelect = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-sm px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const AdminDashboard = () => {
  const {
    users, tasks, stats,
    loading, error,
    taskFilters, setTaskFilters,
    userFilters, setUserFilters,
    deleteUser, updateUserRole, deleteTask,
  } = useAdmin();

  const [confirm, setConfirm] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleConfirm = async () => {
    setActionError(null);

    try {
      if (confirm.type === 'user') {
        await deleteUser(confirm.id);
      }

      if (confirm.type === 'task') {
        await deleteTask(confirm.id);
      }

      if (confirm.type === 'role') {
        const newRole =
          confirm.user.role === 'Admin' ? 'User' : 'Admin';

        await updateUserRole(confirm.id, newRole);
      }
    } catch {
      setActionError('Action failed. Please try again.');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={28} />
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Admin Dashboard</h2>
      </div>

      {(error || actionError) && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error || actionError}
        </div>
      )}

      {/* Stats */}
      <section>
        <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
          <ClipboardList size={18} /> Task Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <StatCard title="Completed" count={stats?.completed ?? 0} colorClass="text-emerald-600" />
              <StatCard title="In Progress" count={stats?.inProgress ?? 0} colorClass="text-blue-600" />
              <StatCard title="Pending" count={stats?.pending ?? 0} colorClass="text-amber-600" />
            </>
          )}
        </div>
      </section>

      {/* Users Table */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Users size={18} /> All Users
          </h3>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-zinc-400" />
            <FilterSelect
              value={userFilters.role}
              onChange={(val) => setUserFilters({ role: val })}
              options={['Admin', 'User']}
              placeholder="All Roles"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-zinc-400 dark:text-zinc-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{user.fullName}</td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{user.username}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${user.role === 'Admin'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setConfirm({ type: 'role', id: user.id, user, message: user.role === 'Admin' ? `Demote "${user.username}" to User?` : `Promote "${user.username}" to Admin?`, })}
                            title={user.role === 'Admin' ? 'Demote to User' : 'Promote to Admin'}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          >
                            {user.role === 'Admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                          </button>
                          <button
                            onClick={() => setConfirm({ type: 'user', id: user.id, message: `Delete user "${user.username}"? This will also delete all their tasks.` })}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tasks Table */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <ClipboardList size={18} /> All Tasks
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-zinc-400" />
            <FilterSelect
              value={taskFilters.status}
              onChange={(val) => setTaskFilters((prev) => ({ ...prev, status: val }))}
              options={['Pending', 'In Progress', 'Completed']}
              placeholder="All Statuses"
            />
            <FilterSelect
              value={taskFilters.priority}
              onChange={(val) => setTaskFilters((prev) => ({ ...prev, priority: val }))}
              options={['Low', 'Medium', 'High']}
              placeholder="All Priorities"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-zinc-400 dark:text-zinc-500">
                      No tasks match the selected filters
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{task.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {task.ownerUsername ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setConfirm({ type: 'task', id: task.id, message: `Delete task "${task.title}"? This cannot be undone.` })}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;