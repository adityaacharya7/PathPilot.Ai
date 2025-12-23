
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { Shield, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Simulate Google Login flow
    const mockUser = {
      name: 'Alex Smith',
      email: 'alex.smith@university.edu',
      targetRole: '', // Will be filled in setup
      skills: [],
      graduationYear: '2025',
      currentLevel: 'Beginner' as const
    };
    
    // If user already has details in local storage, go to dashboard
    const existing = localStorage.getItem('user');
    if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.targetRole) {
            login(parsed);
            navigate('/dashboard');
            return;
        }
    }

    login(mockUser);
    navigate('/profile-setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/20">
            PP
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold dark:text-white">PathPilot AI</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your smart companion from student to specialist.</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-sm space-y-6">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl font-bold hover:shadow-md transition-all active:scale-[0.98]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" />
            <span className="dark:text-white">Sign in with Google</span>
          </button>

          <p className="text-xs text-gray-400 leading-relaxed px-4">
            By signing in, you agree to our Terms of Service and Privacy Policy. We only access your basic academic profile to personalize your experience.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex flex-col items-center gap-2">
             <Shield size={20} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Verified Apps</span>
           </div>
           <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex flex-col items-center gap-2">
             <Sparkles size={20} />
             <span className="text-[10px] font-bold uppercase tracking-widest">AI Roadmaps</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
