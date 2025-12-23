
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Zap, Target, BookOpen, Briefcase, Map, FileText, Sparkles, Shield } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-brand-50 dark:from-slate-900 dark:via-slate-950 dark:to-brand-950/20">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-xs font-black uppercase tracking-widest mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
             <Sparkles size={14} /> AI-Powered Career Platform
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
            From Student to <br /><span className="text-brand-600 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-500">Specialist.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Stop guessing your career. PathPilot uses advanced AI to build roadmaps, optimize resumes, and find verified internships that match your specific skill profile.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/login"
              className="px-10 py-5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-2xl shadow-brand-500/40 flex items-center justify-center gap-3 text-lg hover:-translate-y-1 active:scale-95"
            >
              Get Started for Free <ArrowRight size={22} />
            </Link>
            <button className="px-10 py-5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border dark:border-slate-700 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-lg shadow-sm">
              Explore Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-32 bg-white dark:bg-slate-950 border-y dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl font-black dark:text-white flex items-center gap-4">
                The Career Gap
              </h2>
              <p className="text-gray-500 text-lg">Most students feel lost in the transition between academia and industry. PathPilot bridges that gap.</p>
              <div className="grid gap-4">
                {[
                  { icon: <XCircle className="text-red-500" />, text: "Skills disconnect with job markets" },
                  { icon: <XCircle className="text-red-500" />, text: "Inaccurate, non-ATS friendly resumes" },
                  { icon: <XCircle className="text-red-500" />, text: "Unverified and outdated internships" },
                  { icon: <XCircle className="text-red-500" />, text: "No personalized roadmap or planning" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-600 dark:text-gray-400 font-bold border dark:border-slate-800">
                    {item.icon} {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
                <div className="absolute -inset-4 bg-brand-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-2xl">
                    <h3 className="text-2xl font-black mb-8 dark:text-white flex items-center gap-3">
                        <Shield className="text-brand-600" /> PathPilot Solution
                    </h3>
                    <div className="space-y-6">
                        <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-900/30">
                            <p className="text-sm font-black text-brand-700 dark:text-brand-400 mb-1">AI ROADMAPS</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Step-by-step paths generated for your target role.</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                            <p className="text-sm font-black text-green-700 dark:text-green-400 mb-1">RESUME OPTIMIZER</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Increase ATS score with professional bullet rewrites.</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                            <p className="text-sm font-black text-purple-700 dark:text-purple-400 mb-1">PREP PLANNER</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dynamic study schedules for your upcoming interviews.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
             <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold">PP</div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">© 2024 PathPilot AI. Forging the next generation of industry leaders.</p>
        </div>
      </footer>
    </div>
  );
};

const ModuleCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border dark:border-slate-800 hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-500 transition-all hover:-translate-y-1">
    <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{description}</p>
  </div>
);

export default Landing;
