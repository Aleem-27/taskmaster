import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoreHorizontal, CheckCircle2, Clock, Loader2, Edit3, Trash2 } from 'lucide-react';
import { getPriorityStyle, getStatusIcon } from './TaskListUtils';

const STATUS_OPTIONS = [
  { label: 'Mark as Pending',     value: 'Pending',     icon: <Clock size={14} /> },
  { label: 'Mark as In Progress', value: 'In Progress', icon: <Loader2 size={14} /> },
  { label: 'Mark as Completed',   value: 'Completed',   icon: <CheckCircle2 size={14} /> },
];

const TaskRow = ({ task, onStatusChange, onDelete }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      const clickedButton = buttonRef.current?.contains(e.target);
      const clickedMenu = menuRef.current?.contains(e.target);
      if (!clickedButton && !clickedMenu) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleOpen = () => {
    if (open) {
      setOpen(false);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 208,
    });
    setOpen(true);
  };

  const handleStatusChange = (newStatus) => {
    setOpen(false);
    if (newStatus === task.status) return;
    onStatusChange(task, newStatus);
  };

  const handleDelete = () => {
    setOpen(false);
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (confirmed) onDelete(task.id);
  };

  return (
    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors duration-300">
      <td className="px-6 py-4">
        <Link
          to={`/tasks/${task.id}`}
          className="font-medium text-xs sm:text-base text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
        >
          {task.title}
        </Link>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          {getStatusIcon(task.status)}
          {task.status}
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityStyle(task.priority)}`}>
          {task.priority}
        </span>
      </td>

      <td className="px-6 py-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        {task.dueDate.replace('T', ' ').slice(0, 16)}
      </td>

      <td className="px-6 py-4 text-right">
        <button
          ref={buttonRef}
          onClick={handleOpen}
          className="cursor-pointer text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
        >
          <MoreHorizontal size={20} />
        </button>

        {open && (
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
            className="w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-3 py-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              Set Status
            </div>

            {STATUS_OPTIONS.filter((s) => s.value !== task.status).map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="text-zinc-400">{option.icon}</span>
                {option.label}
              </button>
            ))}

            <div className="border-t border-zinc-100 dark:border-zinc-800" />

            <button
              onClick={() => { setOpen(false); navigate(`/tasks/edit/${task.id}`); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Edit3 size={14} className="text-zinc-400" />
              Edit Task
            </button>

            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={14} />
              Delete Task
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default TaskRow;