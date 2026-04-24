import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, X } from 'lucide-react';

const TaskForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to post to ASP.NET Core API will go here
    console.log("Saving task:", formData);
    navigate('/tasks');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation Header */}
      <button 
        onClick={() => navigate("/tasks")}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors mb-6 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Tasks
      </button>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-zinc-100 bg-zinc-50/50">
          <h2 className="text-2xl font-bold text-zinc-800">Create New Task</h2>
          <p className="text-zinc-500 text-sm mt-1">Fill in the details below to organize your workflow.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 -mt-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Task Title</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="e.g., Complete Database Migration"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Description</label>
            <textarea 
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Describe the task details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Priority</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Due Date</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100">
            <button 
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-6 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              <Save size={18} />
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;