import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Flag, CheckCircle2, Edit3, Trash2 } from 'lucide-react';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - eventually fetched from API using 'id'
  const task = {
    id: id,
    title: 'Fix API Authentication',
    description: 'There is an issue where JWT tokens are expiring sooner than expected. Need to check the middleware configuration and Identity settings.',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-04-20',
    createdAt: '2026-04-10'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 transition-colors">
        <ChevronLeft size={20} /> Back to List
      </button>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex justify-between items-start">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wider">
              {task.priority} Priority
            </span>
            <h1 className="text-3xl font-bold text-zinc-800 mt-3">{task.title}</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
              <Edit3 size={20} />
            </button>
            <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-2">Description</h3>
              <p className="text-zinc-700 leading-relaxed">{task.description}</p>
            </div>
          </div>

          <div className="space-y-6 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <div>
                <p className="text-xs text-zinc-500">Status</p>
                <p className="font-semibold text-zinc-800">{task.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-500" size={20} />
              <div>
                <p className="text-xs text-zinc-500">Due Date</p>
                <p className="font-semibold text-zinc-800">{task.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Flag className="text-zinc-400" size={20} />
              <div>
                <p className="text-xs text-zinc-500">Created At</p>
                <p className="font-semibold text-zinc-800">{task.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;