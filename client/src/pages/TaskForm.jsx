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
    fetchingTask,
    error,
    isEditMode,
    handleChange,
    createTask,
    updateTask,
  } = useTaskForm();

  return (
    <div className="max-w-4xl mx-auto">

      <button
        onClick={() => navigate(isEditMode ? -1 : '/tasks')}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:underline transition-colors duration-300 mb-6 group cursor-pointer"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        {isEditMode ? 'Back to Task' : 'Back to Tasks'}
      </button>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">

        <TaskFormHeader isEditMode={isEditMode} />

        {fetchingTask ? (
          // Skeleton while prefilling form data
          <div className="p-8 space-y-6 animate-pulse">
            <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
              <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        ) : (
          <form
            onSubmit={isEditMode ? updateTask : createTask}
            className="p-8 space-y-6"
          >
            <TaskFormFields
              formData={formData}
              handleChange={handleChange}
              isEditMode={isEditMode}
            />
            <TaskFormActions
              loading={loading}
              isEditMode={isEditMode}
              onCancel={() => navigate(isEditMode ? -1 : '/tasks')}
            />
          </form>
        )}

      </div>
    </div>
  );
};

export default TaskForm;