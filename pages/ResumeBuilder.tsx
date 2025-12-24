
import React, { useState } from 'react';
/* Added Target to imports */
import { FileText, Sparkles, Loader2, Check, Copy, AlertCircle, TrendingUp, Info, ChevronRight, Download, Target } from 'lucide-react';
import { analyzeResumeATS } from '../services/geminiService';
import { useUser } from '../App';
import { ATSAnalysis } from '../types';

const ResumeBuilder: React.FC = () => {
  const { user } = useUser();
  const [bullets, setBullets] = useState<string[]>([
    "Developed a web application using React and Firebase.",
    "Improved database query performance by 20%."
  ]);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const runFullAnalysis = async () => {
    setLoading(true);
    try {
      const resumeData = {
        experience: bullets,
        skills: user?.skills || [],
        education: [`Bachelor's in CS, Class of ${user?.graduationYear || '2025'}`]
      };
      const result = await analyzeResumeATS(resumeData, user?.targetRole || 'Software Engineer');
      setAnalysis(result);
      if (result.generated_resume.sections.experience) {
         // Optionally update the editor with improved bullets
         // setBullets(result.generated_resume.sections.experience);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyImprovedBullets = () => {
    if (analysis) {
      setBullets(analysis.bullet_improvements.map(b => b.improved));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Smart Resume & ATS Analyzer</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Optimizing for recruiters and robots alike.</p>
        </div>
        <div className="flex gap-4">
            <button 
              onClick={runFullAnalysis}
              disabled={loading}
              className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center gap-3 shadow-xl shadow-brand-500/20 active:scale-95 disabled:bg-gray-400"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              Run AI Audit
            </button>
            <button className="px-6 py-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm">
              <Download size={20} /> Export
            </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Editor & Analysis Sidebar */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Editor */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="text-xl font-black mb-8 dark:text-white flex items-center gap-3">
              <FileText className="text-brand-600" /> Professional Experience
            </h2>
            <div className="space-y-6">
              {bullets.map((bullet, idx) => (
                <div key={idx} className="space-y-2 group">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Achievement Bullet {idx + 1}</span>
                    {analysis && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-brand-600 uppercase">
                            <Info size={12} /> Click AI Audit to optimize
                        </div>
                    )}
                  </div>
                  <textarea
                    className="w-full p-6 border dark:border-slate-700 rounded-3xl bg-gray-50 dark:bg-slate-800 focus:ring-4 focus:ring-brand-500/10 outline-none text-sm leading-relaxed min-h-[100px] dark:text-white transition-all"
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = [...bullets];
                      newBullets[idx] = e.target.value;
                      setBullets(newBullets);
                    }}
                  />
                </div>
              ))}
              <button 
                onClick={() => setBullets([...bullets, ""])}
                className="w-full py-5 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-gray-400 font-bold hover:border-brand-300 hover:text-brand-500 transition-all flex items-center justify-center gap-2"
              >
                + Add Experience
              </button>
            </div>
          </section>

          {analysis && (
            <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-brand-50 dark:bg-brand-900/10 p-8 rounded-[2.5rem] border border-brand-100 dark:border-brand-900/30">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-brand-700 dark:text-brand-400">AI Bullet Suggestions</h3>
                        <button 
                            onClick={applyImprovedBullets}
                            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20"
                        >
                            Apply All Fixes
                        </button>
                    </div>
                    <div className="space-y-6">
                        {analysis.bullet_improvements.map((b, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                                    <TrendingUp size={12} /> Optimization Reasoning
                                </div>
                                <p className="text-sm font-medium italic text-gray-500 dark:text-gray-400">"{b.ats_reasoning}"</p>
                                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-900/30 text-sm font-bold dark:text-brand-300 leading-relaxed">
                                    {b.improved}
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {b.keywords_added.map(kw => (
                                        <span key={kw} className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-black uppercase rounded">+{kw}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
          )}
        </div>

        {/* Audit Results Sidebar */}
        <div className="lg:col-span-5 space-y-8">
            
            {/* Score Card */}
            <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${analysis ? 'bg-white dark:bg-slate-900 shadow-xl border-gray-100 dark:border-slate-800' : 'bg-gray-50 dark:bg-slate-900/50 border-dashed border-gray-300 dark:border-slate-800'}`}>
                {!analysis && !loading ? (
                    <div className="text-center py-10 space-y-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                            <Target size={40} />
                        </div>
                        <p className="font-bold text-gray-400 uppercase text-xs tracking-[0.2em]">Awaiting Analysis</p>
                        <p className="text-sm text-gray-500 dark:text-gray-600">Run the audit to see your ATS Readiness score.</p>
                    </div>
                ) : loading ? (
                    <div className="text-center py-10 space-y-6">
                        <div className="w-24 h-24 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mx-auto" />
                        <p className="font-black text-brand-600 animate-pulse">Consulting Recruiting Engine...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">ATS Readiness</p>
                                <h3 className="text-6xl font-black dark:text-white">{analysis.ats_score}%</h3>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${analysis.ats_score > 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {analysis.ats_score > 80 ? 'Excellent' : 'Needs Work'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Fixes</p>
                            <div className="grid gap-3">
                                {analysis.ats_summary.quick_fixes.map((fix, i) => (
                                    <div key={i} className="flex gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-2xl text-xs font-bold text-orange-700 dark:text-orange-400">
                                        <AlertCircle size={16} className="flex-shrink-0" />
                                        {fix}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-brand-600 dark:bg-brand-700 rounded-3xl text-white shadow-lg shadow-brand-500/20">
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Recommended Format</p>
                            <p className="text-lg font-black mb-2">{analysis.recommended_template.template_name}</p>
                            <p className="text-xs opacity-80 leading-relaxed font-medium">{analysis.recommended_template.why_it_works_for_ats}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Skill Gaps */}
            {analysis && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm space-y-6">
                    <h3 className="text-lg font-black dark:text-white flex items-center gap-3">
                        <TrendingUp className="text-green-600" /> Skill Gap Detection
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">High Priority (Missing)</p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.skill_gap_analysis.high_priority.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/30">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Medium Priority</p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.skill_gap_analysis.medium_priority.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-xl border border-orange-100 dark:border-orange-900/30">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-xs font-black uppercase text-gray-500 hover:text-brand-600 transition-colors flex items-center justify-center gap-2">
                        Add to my roadmap <ChevronRight size={14} />
                    </button>
                </div>
            )}

            {/* Strengths */}
            {analysis && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-black mb-6 dark:text-white">Detected Strengths</h3>
                    <div className="space-y-4">
                        {analysis.ats_summary.strengths.map((s, i) => (
                            <div key={i} className="flex gap-4 items-center group">
                                <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                                    <Check size={16} />
                                </div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{s}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
