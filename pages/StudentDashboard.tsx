
import React from 'react';
import { Target, CheckCircle, Clock, TrendingUp, ArrowRight, User as UserIcon, Calendar, Star, ChevronRight, Bot, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../App';

const StudentDashboard: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
            Welcome, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            Your {user?.targetRole || 'Specialist'} journey is 65% complete.
          </p>
        </div>
        <div className="relative">
           <div className="w-16 h-16 rounded-3xl border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-brand-100 ring-4 ring-brand-500/10">
             {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             ) : (
                <div className="flex items-center justify-center h-full text-brand-600">
                  <UserIcon size={32} />
                </div>
             )}
           </div>
           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-950 rounded-full shadow-sm"></div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Target className="text-indigo-600" />} label="Focus" value={user?.targetRole || 'Not Set'} />
        <StatCard icon={<TrendingUp className="text-green-600" />} label="Level" value={user?.currentLevel || 'Beginner'} />
        <StatCard icon={<ShieldCheck className="text-brand-600" />} label="ATS Score" value="82%" />
        <StatCard icon={<Star className="text-orange-600" />} label="Batch" value={`Class of ${user?.graduationYear}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Progress Tracker */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black dark:text-white tracking-tight">Career Roadmap</h2>
              <Link to="/roadmap" className="p-2 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                <ArrowRight className="text-brand-600" size={20} />
              </Link>
            </div>
            <div className="space-y-10">
              <ProgressItem label="Technical Proficiency" progress={72} color="bg-brand-600" />
              <ProgressItem label="Portfolio & Projects" progress={48} color="bg-blue-500" />
              <ProgressItem label="Placement Readiness" progress={30} color="bg-emerald-500" />
            </div>
          </section>

          {/* Upcoming Career Timeline */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-black mb-8 dark:text-white tracking-tight">Upcoming Opportunities</h2>
            <div className="space-y-6">
               <TimelineItem 
                 date="Nov 15" 
                 title="Google SDE Internships Open" 
                 desc="Prepare your referral and resume bullets by next Friday." 
                 status="High Match"
               />
               <TimelineItem 
                 date="Nov 22" 
                 title="Mock Interview - System Design" 
                 desc="Live session with industry experts from Stripe." 
                 status="Registered"
               />
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-brand-600 dark:bg-brand-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-brand-500/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Bot size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">AI Insight</h3>
              <p className="text-brand-100 text-base mb-8 leading-relaxed font-medium">
                "{user?.name.split(' ')[0]}, your React skills are high, but your ATS score is low for {user?.targetRole}. Let's optimize your resume!"
              </p>
              <Link to="/resume" className="block w-full py-5 bg-white text-brand-600 rounded-2xl font-bold text-center hover:bg-brand-50 transition-all shadow-xl shadow-brand-900/10 active:scale-[0.98]">
                Boost ATS Score
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-xl font-black mb-8 dark:text-white">Active Tasks</h3>
            <div className="space-y-6">
              <MilestoneItem date="Oct 28" task="Optimize Resume Bullets" isDone={false} />
              <MilestoneItem date="Oct 24" task="Verify Internship Eligibility" isDone={true} />
              <MilestoneItem date="Oct 12" task="Google Auth Connected" isDone={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem: React.FC<{ date: string, title: string, desc: string, status: string }> = ({ date, title, desc, status }) => (
  <div className="flex gap-6 group cursor-pointer">
    <div className="flex flex-col items-center">
       <div className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">{date.split(' ')[0]}</div>
       <div className="text-lg font-black dark:text-white">{date.split(' ')[1]}</div>
       <div className="w-px h-full bg-gray-100 dark:bg-slate-800 group-last:bg-transparent mt-2"></div>
    </div>
    <div className="flex-1 pb-8">
       <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border dark:border-slate-800 group-hover:border-brand-300 dark:group-hover:border-brand-500/50 transition-all">
          <div className="flex justify-between items-start mb-2">
             <h4 className="font-bold text-lg dark:text-white">{title}</h4>
             <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase rounded-lg">
               {status}
             </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
       </div>
    </div>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-slate-900 p-7 rounded-[2.5rem] border dark:border-slate-800 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20">{icon}</div>
    <div>
      <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

const ProgressItem: React.FC<{ label: string; progress: number; color: string }> = ({ label, progress, color }) => (
  <div className="group">
    <div className="flex justify-between text-base mb-4">
      <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors">{label}</span>
      <span className="font-black text-brand-600 dark:text-brand-400">{progress}%</span>
    </div>
    <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-sm`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const MilestoneItem: React.FC<{ date: string; task: string; isDone: boolean }> = ({ date, task, isDone }) => (
  <div className="flex gap-4 items-center group">
    <div className={`w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isDone ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 border dark:border-slate-700'}`}>
       {isDone ? <CheckCircle size={14} /> : <div className="w-1 h-1 bg-current rounded-full" />}
    </div>
    <div className="flex-1">
      <p className={`text-sm font-bold ${isDone ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-900 dark:text-white'}`}>{task}</p>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{date}</p>
    </div>
    <ChevronRight size={14} className="text-gray-300 dark:text-gray-700 opacity-0 group-hover:opacity-100 transition-all" />
  </div>
);

export default StudentDashboard;
