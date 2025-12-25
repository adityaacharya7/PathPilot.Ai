import React, { useEffect, useState } from 'react';
import { Target, CheckCircle, Clock, TrendingUp, ArrowRight, User as UserIcon, Calendar, Star, ChevronRight, Bot, ShieldCheck, Zap, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../App';
import { fetchJobs, Job } from '../src/services/jobService';

const StudentDashboard: React.FC = () => {
  const { user } = useUser();
  const [opportunities, setOpportunities] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (user) {
      setLoadingJobs(true);
      fetchJobs(user).then(jobs => {
        setOpportunities(jobs.slice(0, 5));
        setLoadingJobs(false);
      });
    }
  }, [user]);

  // Mock Data for new Layout
  const nextBestAction = {
    title: "Optimize Resume Summary",
    desc: "Your profile summary is missing key keywords for 'Frontend Developer'. Fix this to increase visibility.",
    time: "5 min",
    impact: "High Impact",
    link: "/resume"
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Hello, {user?.name.split(' ')[0] || 'Scholar'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Let's make some progress on your <span className="text-brand-600 dark:text-brand-400 font-bold">{user?.targetRole || 'Career'}</span> journey.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">System Online</span>
        </div>
      </header>

      {/* 2. Next Best Action (Primary Tier) */}
      <section className="bg-gradient-to-r from-gray-900 to-slate-800 dark:from-indigo-950 dark:to-slate-900 rounded-[2rem] p-1 text-white shadow-xl">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-[1.8rem] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/40 flex-shrink-0 animate-bounce">
            <Zap size={32} fill="currentColor" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-brand-500/20 text-brand-300 text-xs font-black uppercase tracking-widest px-2 py-1 rounded-md border border-brand-500/30">Next Best Action</span>
              <span className="flex items-center gap-1 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <Clock size={12} /> {nextBestAction.time}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{nextBestAction.title}</h2>
            <p className="text-gray-300 leading-relaxed max-w-2xl">{nextBestAction.desc}</p>
          </div>
          <Link to={nextBestAction.link} className="w-full md:w-auto px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group whitespace-nowrap">
            Start Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress & Tasks (Primary/Secondary) */}
        <div className="lg:col-span-8 space-y-8">

          {/* 3. Career Progress (Milestone Based) */}
          <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="text-brand-600" /> Career Milestones
              </h3>
              <span className="text-sm font-bold text-gray-400">Class of {user?.graduationYear || '2025'}</span>
            </div>

            <div className="relative pt-4 pb-2">
              <div className="absolute top-[15px] left-0 w-full h-1 bg-gray-100 dark:bg-slate-800 rounded-full -z-10"></div>
              <div className="absolute top-[15px] left-0 w-[65%] h-1 bg-brand-600 dark:bg-brand-500 rounded-full -z-10 transition-all duration-1000"></div>

              <div className="flex justify-between">
                {['Student', 'Learning', 'Internship', 'Specialist'].map((stage, i) => {
                  const isActive = i <= 2; // Mock progress
                  const isCurrent = i === 2;
                  return (
                    <div key={stage} className={`flex flex-col items-center gap-3 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isActive ? 'bg-brand-600 border-white dark:border-slate-950 text-white shadow-lg' : 'bg-gray-200 dark:bg-slate-800 border-white dark:border-slate-950 text-gray-500'}`}>
                        {isActive ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500'}`}>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3.5. Detailed Stats (RPG Attributes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="text-brand-600" size={20} />  Readiness Attributes
              </h3>
              <div className="space-y-6">
                <AttributeBar label="Technical Proficiency" value={user?.atsBreakdown ? Math.round(user.atsBreakdown.keyword_relevance * 0.45) : 10} color="bg-brand-600" />
                <AttributeBar label="Portfolio Strength" value={user?.atsBreakdown ? Math.round(user.atsBreakdown.content_strength * 0.45) : 10} color="bg-indigo-500" />
                <AttributeBar label="Interview Readiness" value={user?.atsBreakdown ? Math.round(user.atsBreakdown.role_alignment * 0.45) : 5} color="bg-emerald-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-50/50 dark:bg-brand-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 z-10">ATS Health</h3>
              <div className="relative w-32 h-32 flex items-center justify-center mb-2 z-10">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-brand-500 drop-shadow-lg" strokeDasharray={`${user?.atsScore || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{user?.atsScore || 0}</span>
                  <span className="text-[10px] font-bold text-gray-400">/ 100</span>
                </div>
              </div>
              <Link to="/resume" className="text-xs font-bold text-brand-600 hover:text-brand-700 z-10">View Report &rarr;</Link>
            </div>
          </div>

          {/* 6. Active Tasks (Secondary) */}
          <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div> Active Tasks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <TaskItem
                title="Update LinkedIn Profile"
                tag="Personal Brand"
                due="Today"
                priority="High"
              />
              <TaskItem
                title="Complete React Assessment"
                tag="Skill Verification"
                due="Tomorrow"
                priority="Medium"

              />
              <TaskItem
                title="Apply to 3 Internships"
                tag="Job Hunt"
                due="Fri, Oct 24"
                priority="Medium"
              />
            </div>
          </div>

        </div>

        {/* Right Column: AI & Opportunities (Tertiary) */}
        <div className="lg:col-span-4 space-y-8">

          {/* 4. AI Insight Card */}
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Bot size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Sparkles size={18} />
                </div>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">AI Insight</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-bold text-lg mb-2">
                "Your logic skills are top-tier, {user?.name.split(' ')[0]}, but your <span className="underline decoration-indigo-400 decoration-2 underline-offset-2">System Design</span> knowledge is lacking compared to other {user?.targetRole} candidates."
              </p>
              <div className="mt-6 pt-4 border-t border-indigo-200 dark:border-indigo-900/50">
                <Link to="/planner" className="text-sm font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2 hover:gap-3 transition-all">
                  View Study Plan <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* 5. Opportunities (Compact) */}
          <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex justify-between items-center">
              Top Opportunities
              <Link to="/internships" className="text-xs font-bold text-brand-600 hover:underline">View All</Link>
            </h3>
            <div className="space-y-4">
              {loadingJobs ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-slate-900 rounded-2xl"></div>)}
                </div>
              ) : (
                opportunities.slice(0, 3).map((job) => (
                  <CompactJobCard key={job.id} job={job} />
                ))
              )}
              {opportunities.length === 0 && !loadingJobs && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">No matches found yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const TaskItem = ({ title, tag, due, priority }: { title: string, tag: string, due: string, priority: string }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 rounded-2xl transition-all group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{tag} • Due {due}</p>
      </div>
    </div>
    <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-300 group-hover:text-brand-600 group-hover:border-brand-200 transition-all">
      <ArrowRight size={14} />
    </div>
  </div>
);

const CompactJobCard = ({ job }: { job: Job }) => (
  <div onClick={() => job.url && window.open(job.url, '_blank')} className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-gray-500 uppercase">
      {job.company.substring(0, 2)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate pr-2">{job.title}</h4>
        {job.matchScore && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded text-green-700 bg-green-100`}>
            {job.matchScore}%
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{job.company}</p>
      <div className="flex gap-1 mt-1.5">
        {(job.tags || []).slice(0, 2).map(tag => (
          <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-md border border-gray-200 dark:border-slate-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const AttributeBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-xs font-black text-gray-900 dark:text-white">{value}/100</span>
    </div>
    <div className="h-2 w-full bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default StudentDashboard;
