
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { ArrowRight, Sparkles, User, GraduationCap, Target } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({
    targetRole: '',
    graduationYear: '2025',
    currentLevel: 'Beginner' as const,
    skills: [] as string[]
  });

  const next = () => setStep(step + 1);

  const finish = () => {
    if (user) {
      updateProfile({ ...user, ...details });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-brand-600' : 'bg-gray-200 dark:bg-slate-800'}`} />
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-brand-600">
                <Target size={24} />
                <h2 className="text-2xl font-bold dark:text-white">What is your dream role?</h2>
              </div>
              <p className="text-gray-500">This helps us tailor your roadmaps and prep plans.</p>
              <input 
                autoFocus
                type="text"
                placeholder="e.g. Frontend Developer, Data Scientist..."
                className="w-full p-4 text-xl border-b-2 bg-transparent border-brand-200 focus:border-brand-600 outline-none transition-colors dark:text-white"
                value={details.targetRole}
                onChange={(e) => setDetails({...details, targetRole: e.target.value})}
              />
              <button 
                disabled={!details.targetRole}
                onClick={next}
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-brand-600">
                <GraduationCap size={24} />
                <h2 className="text-2xl font-bold dark:text-white">Academic Details</h2>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider">Graduation Year</label>
                <div className="grid grid-cols-3 gap-3">
                  {['2025', '2026', '2027'].map(year => (
                    <button 
                      key={year}
                      onClick={() => setDetails({...details, graduationYear: year})}
                      className={`p-4 rounded-xl border-2 transition-all ${details.graduationYear === year ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-gray-100 dark:border-slate-800 dark:text-gray-400'}`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider">Current Prep Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                    <button 
                      key={level}
                      onClick={() => setDetails({...details, currentLevel: level})}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${details.currentLevel === level ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-gray-100 dark:border-slate-800 dark:text-gray-400'}`}
                    >
                      {level}
                      <span className="text-xs opacity-60">
                        {level === 'Beginner' ? 'Just starting' : level === 'Intermediate' ? 'Know basics' : 'Interview ready'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={next}
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-bold dark:text-white">Ready to take flight!</h2>
              <p className="text-gray-500">PathPilot AI is now configured for your goal: <span className="text-brand-600 font-bold">{details.targetRole}</span>.</p>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Setup Summary</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Target Role</p>
                    <p className="font-bold dark:text-white">{details.targetRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Class of</p>
                    <p className="font-bold dark:text-white">{details.graduationYear}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={finish}
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
