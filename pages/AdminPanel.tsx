
import React from 'react';
import { Users, Briefcase, GraduationCap, FileCheck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const PROGRESS_DATA = [
  { name: 'SDE', count: 45, color: '#4f46e5' },
  { name: 'Data Analyst', count: 28, color: '#06b6d4' },
  { name: 'UI/UX', count: 15, color: '#a855f7' },
  { name: 'Product', count: 12, count_full: 100, color: '#f97316' },
];

const PLACEMENT_STATS = [
  { name: 'Placed', value: 65, color: '#10b981' },
  { name: 'Preparing', value: 25, color: '#3b82f6' },
  { name: 'At Risk', value: 10, color: '#ef4444' },
];

const AdminPanel: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Placement Cell Dashboard</h1>
        <p className="text-gray-500">Real-time student readiness and participation analytics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <AdminStat icon={<Users className="text-indigo-600" />} label="Total Students" value="1,240" delta="+12%" />
        <AdminStat icon={<Briefcase className="text-green-600" />} label="Active Internships" value="48" delta="+5" />
        <AdminStat icon={<GraduationCap className="text-purple-600" />} label="Avg Readiness" value="72%" delta="+8%" />
        <AdminStat icon={<FileCheck className="text-orange-600" />} label="Resumes Verified" value="982" delta="100%" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Readiness Heatmap / Chart */}
        <section className="bg-white p-8 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" /> Skill Readiness Heatmap
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROGRESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {PROGRESS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Placement Funnel */}
        <section className="bg-white p-8 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Users size={20} className="text-indigo-600" /> Current Placement Funnel
          </h2>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLACEMENT_STATS}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PLACEMENT_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-12">
              {PLACEMENT_STATS.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                  <span className="text-sm font-medium text-gray-600">{s.name}: {s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Critical List */}
      <section className="bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-6">Students at Risk (Behind Prep Schedule)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase">Student Name</th>
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase">Target Role</th>
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase">Progress</th>
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase">Days Left</th>
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { name: 'Jordan V.', role: 'SDE', progress: 34, days: 12, status: 'Critical' },
                { name: 'Sarah L.', role: 'Data Analyst', progress: 15, days: 45, status: 'Behind' },
                { name: 'Mike T.', role: 'SDE', progress: 20, days: 30, status: 'Behind' },
              ].map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium">{s.name}</td>
                  <td className="py-4 text-gray-600">{s.role}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${s.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-bold">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 font-bold">{s.days}d</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      s.status === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const AdminStat: React.FC<{ icon: React.ReactNode; label: string; value: string; delta: string }> = ({ icon, label, value, delta }) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">{icon}</div>
      <span className="text-xs font-bold text-green-600">{delta}</span>
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  </div>
);

export default AdminPanel;
