import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useTaskForm from '../hooks/useTaskForm';

import TaskFormHeader from '../components/tasks/TaskFormHeader';
import TaskFormFields from '../components/tasks/TaskFormFields';
import TaskFormActions from '../components/tasks/TaskFormActions';

const TaskForm = () => {
  const navigate = useNavigate();

  const {
    formData,
    loading,
    error,

    handleChange,
    createTask,
  } = useTaskForm();

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:underline transition-colors duration-300 mb-6 group cursor-pointer"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />

        Back to Tasks
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">

        <TaskFormHeader />

        <form
          onSubmit={createTask}
          className="p-8 space-y-6"
        >

          <TaskFormFields
            formData={formData}
            handleChange={handleChange}
          />

          <TaskFormActions
            loading={loading}
            onCancel={() => navigate('/tasks')}
          />

        </form>
      </div>
    </div>
  );
};

export default TaskForm;