import { User, Mail, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  // Moch User Data
  const user = {
    name: "Aleem Ullah Khan",
    email: "aleem@example.com",
    role: "Regular User", 
    joined: "March 2026"
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-zinc-800 mb-6">User Profile</h2>

      <div className="bg-white rounded 2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-linear-to-r from-emerald-500 to-teal-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white">
              <User size={40} className="text-emerald-600" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <User size={20} className="text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Full Name</p>
                  <p className="text-zinc-800 font-medium">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <Mail size={20} className="text-zinc-400 flex shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Email</p>
                  <p className="text-zinc-800 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <Shield size={20} className="text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Role</p>
                  <p className="text-zinc-800 font-medium">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100">
              <button className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
                <LogOut size={20} />
                Sign Out from Device
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;