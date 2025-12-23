
import React from 'react';
import { Target, CheckCircle, Clock, TrendingUp, ArrowRight, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../App';

const StudentDashboard: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">You're making great progress towards your goal of becoming a <span className="font-bold text-brand-600">{user?.targetRole || 'Specialist'}</span>.</p>
        </div>
        <div className="flex -space-x-3">
           <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-gray-200 overflow-hidden">
             {user?.avatar ? <img src={user.avatar} /> : <div className="flex items-center justify-center h-full"><UserIcon size={16} /></div>}
           </div>
           <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
             AI
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Target className="text-indigo-600" />} label="Target Role" value={user?.targetRole || 'Not Set'} />
        <StatCard icon={<CheckCircle className="text-green-600" />} label="Level" value={user?.currentLevel || 'Beginner'} />
        <StatCard icon={<Clock className="text-orange-600" />} label="Batch" value={`Class of ${user?.graduationYear}`} />
        <StatCard icon={<TrendingUp className="text-brand-600" />} label="Resume Score" value="82/100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold dark:text-white">Placement Readiness</h2>
              <Link to="/planner" className="text-brand-600 dark:text-brand-400 text-sm font-bold flex items-center gap-1 hover:underline">
                Personalized Plan <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-8">
              <ProgressItem label="Core Skills Proficiency" progress={65} color="bg-brand-600" />
              <ProgressItem label="Project Portfolio" progress={40} color="bg-blue-500" />
              <ProgressItem label="Mock Interview Score" progress={20} color="bg-purple-500" />
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="text-xl font-bold mb-6 dark:text-white">AI Recommendations</h2>
            <div className="space-y-4">
              <RecommendationCard
                company="TechCorp Inc."
                role={`${user?.targetRole || 'Intern'}`}
                match={94}
                tags={['Top Match', 'Verified']}
              />
              <RecommendationCard
                company="InnovateSoft"
                role="Full Stack Assistant"
                match={88}
                tags={['Intermediate']}
              />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-brand-500/20">
            <h3 className="text-xl font-bold mb-3">AI Advisor Active</h3>
            <p className="text-brand-100 text-sm mb-6 leading-relaxed">
              "Based on your profile, you should focus on sharpening your Data Structure skills this week."
            </p>
            <Link to="/advisor" className="block w-full py-4 bg-white text-brand-600 rounded-2xl font-bold text-center hover:bg-brand-50 transition-all active:scale-95 shadow-lg">
              Start Conversation
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="font-bold mb-6 dark:text-white">Next Steps</h3>
            <div className="space-y-6">
              <MilestoneItem date="In 2 days" task="Generate Skill Roadmap" isDone={false} />
              <MilestoneItem date="Yesterday" task="Completed Profile Setup" isDone={true} />
              <MilestoneItem date="Oct 15" task="Linked Google Account" isDone={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
    <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20">{icon}</div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-black dark:text-white">{value}</p>
    </div>
  </div>
);

const ProgressItem: React.FC<{ label: string; progress: number; color: string }> = ({ label, progress, color }) => (
  <div className="group">
    <div className="flex justify-between text-sm mb-3">
      <span className="font-bold text-gray-700 dark:text-gray-300">{label}</span>
      <span className="font-black text-brand-600">{progress}%</span>
    </div>
    <div className="h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const RecommendationCard: React.FC<{ company: string; role: string; match: number; tags: string[] }> = ({ company, role, match, tags }) => (
  <div className="flex items-center justify-between p-5 border dark:border-slate-800 rounded-2xl hover:border-brand-300 dark:hover:border-brand-500 transition-all cursor-pointer group bg-white dark:bg-slate-900 shadow-sm">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center font-black text-brand-600 dark:text-brand-400 text-xl border dark:border-brand-900/40">
        {company[0]}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-600 transition-colors">{role}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{company}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xs font-black text-green-600 dark:text-green-400 mb-2 uppercase tracking-tighter">{match}% AI Match</div>
      <div className="flex gap-2 justify-end">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800 text-[10px] rounded-lg border dark:border-slate-700 uppercase font-black text-gray-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 group-hover:text-brand-600 transition-colors">{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

const MilestoneItem: React.FC<{ date: string; task: string; isDone: boolean }> = ({ date, task, isDone }) => (
  <div className="flex gap-4 items-start group">
    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 border-2 ${isDone ? 'bg-brand-600 border-brand-600' : 'bg-transparent border-gray-300 dark:border-slate-700'}`}></div>
    <div className="transition-transform group-hover:translate-x-1 duration-300">
      <p className={`text-sm font-bold ${isDone ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-900 dark:text-white'}`}>{task}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{date}</p>
    </div>
  </div>
);

export default StudentDashboard;
