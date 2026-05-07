import { Save } from 'lucide-react';

const TaskFormActions = ({
  loading,
  onCancel,
}) => {
  return (
    <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">

      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-300 cursor-pointer"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-60 transition-all shadow-lg shadow-emerald-100 dark:shadow-none cursor-pointer"
      >
        <Save size={18} />

        {loading ? 'Saving...' : 'Save Task'}
      </button>

    </div>
  );
};

export default TaskFormActions;