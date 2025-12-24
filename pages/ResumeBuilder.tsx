
import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Sparkles, Loader2, UploadCloud, X, File as FileIcon, Target, 
  Briefcase, Zap, ShieldAlert, AlertCircle, TrendingUp, Download, MessageSquare, Send, Bot
} from 'lucide-react';
import { analyzeResumeATS, chatWithResume } from '../services/geminiService';
import { useUser } from '../App';
import { ATSAnalysis, ChatMessage } from '../types';
import { 
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import ReactMarkdown from 'react-markdown';

const ResumeBuilder: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  
  // Manual Data State
  const [bullets, setBullets] = useState<string[]>([
    "Developed a web application using React and Firebase.",
    "Improved database query performance by 20%."
  ]);
  
  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common State
  const [jobDescription, setJobDescription] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState(user?.targetRole || "Software Engineer");
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF or Image file.");
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Clean = result.split(',')[1];
      setFileBase64(base64Clean);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setFileBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setAnalysis(null);
    setChatMessages([]);
  };

  const runFullAnalysis = async () => {
    if (activeTab === 'upload' && !file) {
      alert("Please upload a resume file first.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setChatMessages([]);
    
    try {
      let fileData = undefined;
      let resumeData = undefined;

      if (activeTab === 'upload' && file && fileBase64) {
        fileData = {
          data: fileBase64,
          mimeType: file.type
        };
      } else {
        resumeData = {
          experience: bullets,
          skills: user?.skills || [],
          education: [`Bachelor's in CS, Class of ${user?.graduationYear || '2025'}`]
        };
      }
      
      const result = await analyzeResumeATS(
        resumeData, 
        targetRoleInput, 
        jobDescription.trim() || "NONE",
        user?.currentLevel || "Junior",
        "Tech",
        fileData
      );
      
      setAnalysis(result);
      
      // Initialize Chat
      setChatMessages([{
        role: 'assistant',
        content: `I've analyzed your resume! Your ATS score is **${result.ats_score.total}%**. I found some gaps in ${result.keyword_analysis.missing_critical.slice(0, 2).join(', ') || 'keywords'}. Ask me how to fix them!`
      }]);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !analysis) return;
    
    const userMsg: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await chatWithResume(chatMessages, analysis, chatInput);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const radialData = analysis ? [
    { name: 'Total', value: analysis.ats_score.total, fill: '#4f46e5' }
  ] : [];

  const radarData = analysis ? [
    { subject: 'Keywords', A: analysis.ats_score.breakdown.keyword_relevance, fullMark: 30 },
    { subject: 'Format', A: analysis.ats_score.breakdown.formatting, fullMark: 20 },
    { subject: 'Impact', A: analysis.ats_score.breakdown.content_strength, fullMark: 20 },
    { subject: 'Role', A: analysis.ats_score.breakdown.role_alignment, fullMark: 20 },
    { subject: 'Complete', A: analysis.ats_score.breakdown.completeness, fullMark: 10 },
  ] : [];

  return (
    <div className="p-4 md:p-8 max-w-[95rem] mx-auto space-y-6 animate-in fade-in duration-700 relative">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
             Resume Architect <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-black rounded-full uppercase tracking-widest">AI</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
             Upload, Analyze, and Chat with your Resume to beat the ATS.
          </p>
        </div>
        <div className="flex gap-4">
            <button 
              onClick={runFullAnalysis}
              disabled={loading}
              className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center gap-3 shadow-xl shadow-brand-500/20 active:scale-95 disabled:bg-gray-400"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              Run Audit
            </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 relative">
        
        {/* LEFT: INPUT & PREVIEW */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Role</label>
                <input 
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold dark:text-white"
                />
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Context (Optional JD)</label>
                <input 
                  placeholder="Paste Job Description..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 font-medium text-sm dark:text-white"
                />
             </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              {activeTab === 'upload' && !file ? (
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex-1 flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                 >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
                    <div className="w-24 h-24 bg-brand-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform mb-6">
                       <UploadCloud size={40} />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">Upload Resume</h3>
                    <p className="text-gray-400 mt-2">PDF, PNG, JPG supported</p>
                 </div>
              ) : activeTab === 'upload' && file ? (
                 <div className="flex-1 flex flex-col">
                    <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center">
                             <FileIcon size={24} />
                          </div>
                          <div>
                             <p className="font-bold dark:text-white">{file.name}</p>
                             <p className="text-xs text-gray-400 uppercase font-bold">Ready for Analysis</p>
                          </div>
                       </div>
                       <button onClick={removeFile} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors">
                          <X size={20} />
                       </button>
                    </div>
                    {/* Visual Preview Placeholder - In a real app, use pdf.js */}
                    <div className="flex-1 bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-10 relative overflow-hidden">
                       <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                       <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl rounded-xl p-8 space-y-4 opacity-50 blur-[1px] transform scale-95 origin-top">
                          <div className="h-8 w-1/2 bg-gray-200 dark:bg-slate-800 rounded mb-8"></div>
                          <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded"></div>
                          <div className="h-4 w-3/4 bg-gray-100 dark:bg-slate-800 rounded"></div>
                          <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded"></div>
                          <div className="mt-8 h-6 w-1/3 bg-gray-200 dark:bg-slate-800 rounded"></div>
                          <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded"></div>
                          <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded"></div>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-xl font-bold dark:text-white flex items-center gap-2">
                             <ShieldAlert size={16} className="text-brand-600" /> Preview Mode
                          </div>
                       </div>
                    </div>
                 </div>
              ) : (
                // Manual Mode Editor
                <div className="p-6 space-y-4">
                  <h3 className="font-bold dark:text-white">Manual Editor</h3>
                   {bullets.map((bullet, idx) => (
                    <textarea
                      key={idx}
                      className="w-full p-4 border dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500/50 outline-none text-sm dark:text-white"
                      value={bullet}
                      onChange={(e) => {
                        const newBullets = [...bullets];
                        newBullets[idx] = e.target.value;
                        setBullets(newBullets);
                      }}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* RIGHT: ANALYSIS & CHAT */}
        <div className="lg:col-span-6 space-y-6">
            
            {loading ? (
                 <div className="h-[600px] bg-white dark:bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center border dark:border-slate-800">
                    <div className="w-24 h-24 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
                    <p className="text-xl font-black dark:text-white animate-pulse">Analyzing Resume...</p>
                    <p className="text-gray-400 mt-2">Checking ATS Compatibility</p>
                 </div>
            ) : !analysis ? (
                 <div className="h-[600px] bg-gray-50 dark:bg-slate-900/50 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10">
                    <Target size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                    <h3 className="text-xl font-bold dark:text-white">Ready to Audit</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Upload your resume to see the score, gaps, and AI improvements.</p>
                 </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-700">
                    
                    {/* 1. Score & Stats Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Overall Score */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <h3 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-4">Overall ATS Score</h3>
                            <div className="h-48 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart innerRadius="80%" outerRadius="100%" barSize={20} data={radialData} startAngle={90} endAngle={-270}>
                                        <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-5xl font-black dark:text-white">{analysis.ats_score.total}</span>
                                    <span className="text-xs font-bold text-gray-400">/ 100</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown Radar */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm">
                             <h3 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-2">Metrics Breakdown</h3>
                             <div className="h-48 w-full text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 800 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                        <Radar name="Resume" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                                    </RadarChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                    </div>

                    {/* 2. Improvements List (Diff View) */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
                                <Zap size={20} className="text-brand-600" /> High-Impact Fixes
                            </h3>
                        </div>
                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {analysis.bullet_improvements.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.improvement_type}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl">
                                            <p className="text-[10px] font-black text-red-500 uppercase mb-2">Original</p>
                                            <p className="text-sm text-red-800 dark:text-red-300 line-through opacity-70">{item.original}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl relative">
                                            <div className="absolute top-4 right-4 text-green-500">
                                                <Sparkles size={14} />
                                            </div>
                                            <p className="text-[10px] font-black text-green-600 uppercase mb-2">AI Rewrite</p>
                                            <p className="text-sm font-bold text-green-900 dark:text-green-300">{item.improved}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Keyword Gaps */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-black dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-brand-600" /> Keyword Gap Analysis
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.keyword_analysis.missing_critical.length > 0 ? (
                                analysis.keyword_analysis.missing_critical.map(k => (
                                    <span key={k} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-xl text-xs font-bold flex items-center gap-1">
                                        <AlertCircle size={10} /> {k}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 italic text-sm">No critical keywords missing. Great job!</span>
                            )}
                        </div>
                    </div>

                    {/* 4. Chat Interface (Integrated) */}
                    <div className="bg-brand-900 dark:bg-slate-950 text-white p-1 rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="bg-brand-800/50 dark:bg-slate-900/50 p-6 flex justify-between items-center cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                     <Bot size={20} className="text-brand-200" />
                                 </div>
                                 <div>
                                     <h3 className="font-bold">Resume Assistant</h3>
                                     <p className="text-xs text-brand-200">Ask questions about your ATS analysis</p>
                                 </div>
                             </div>
                             <div className={`transition-transform duration-300 ${isChatOpen ? 'rotate-180' : ''}`}>
                                 <TrendingUp size={20} />
                             </div>
                        </div>

                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isChatOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <div className="p-6 pt-0 space-y-4">
                                <div className="h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar bg-black/20 rounded-2xl p-4" ref={chatScrollRef}>
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-white text-brand-900' : 'bg-white/10 text-white'}`}>
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/10 p-3 rounded-2xl">
                                                <Loader2 size={16} className="animate-spin text-brand-200" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex gap-2">
                                    <input 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                                        placeholder="E.g., How do I fix the formatting?"
                                        className="flex-1 bg-white/10 border-none rounded-xl px-4 py-3 text-sm text-white placeholder-brand-300 focus:ring-2 focus:ring-brand-400 outline-none"
                                    />
                                    <button 
                                        onClick={handleChatSubmit}
                                        disabled={chatLoading}
                                        className="p-3 bg-white text-brand-900 rounded-xl hover:bg-brand-50 transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
