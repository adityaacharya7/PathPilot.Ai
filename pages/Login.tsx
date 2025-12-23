
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { Shield, Sparkles, AlertCircle, Terminal, User as UserIcon } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

const Login: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [showDevLogin, setShowDevLogin] = useState(false);

  // Helper to decode the Google JWT (if real)
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const processUserAndRedirect = (userData: any) => {
    // Check if user already has saved preferences in local storage
    const existingRaw = localStorage.getItem('user');
    if (existingRaw) {
      const existing = JSON.parse(existingRaw);
      if (existing.email === userData.email) {
        const merged = { ...existing, ...userData };
        login(merged);
        if (merged.targetRole) {
          navigate('/dashboard');
          return;
        }
      }
    }

    login(userData);
    navigate('/profile-setup');
  };

  const handleCredentialResponse = (response: any) => {
    const payload = decodeJwt(response.credential);
    if (!payload) {
      // If payload is null (like in the demo bypass), we use a high-quality mock
      const demoUser = {
        name: 'Demo Student',
        email: 'student@university.edu',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
        targetRole: '',
        skills: [],
        graduationYear: '2025',
        currentLevel: 'Beginner' as const
      };
      processUserAndRedirect(demoUser);
    } else {
      const googleUser = {
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        targetRole: '',
        skills: [],
        graduationYear: '2025',
        currentLevel: 'Beginner' as const
      };
      processUserAndRedirect(googleUser);
    }
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            // Note: This ID is a placeholder. Real OAuth requires a client_id registered for your domain.
            client_id: '1065445353526-mrtre7f9o0p6p0v0p0p0p0p0p0p0p0.apps.googleusercontent.com', 
            callback: handleCredentialResponse,
          });

          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
            });
          }
        } catch (err) {
          console.warn('Google Sign-In initialization failed (likely due to invalid Client ID).');
        }
      }
    };

    const checkInterval = setInterval(() => {
      if (window.google) {
        initializeGoogleSignIn();
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6 transition-colors duration-500">
      <div className="max-w-md w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-brand-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-brand-500/40 relative z-10">
            PP
          </div>
          <div className="absolute -inset-4 bg-brand-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black dark:text-white tracking-tighter sm:text-5xl">PathPilot AI</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-tight">
            The intelligent engine for your career takeoff.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 shadow-xl space-y-8 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="space-y-6 relative z-10">
             <div className="space-y-4">
                <div ref={googleBtnRef} className="w-full flex justify-center"></div>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or Instant Access</span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800"></div>
                </div>

                <button 
                  onClick={() => handleCredentialResponse({ credential: null })}
                  className="group w-full flex items-center justify-center gap-3 py-4 px-6 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 active:scale-95"
                >
                  <Terminal size={18} className="group-hover:rotate-12 transition-transform" />
                  Continue as Developer
                </button>
             </div>

             <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border dark:border-slate-800 text-left space-y-3">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <AlertCircle size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Auth Note</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Real Google Login requires a domain-verified Client ID. For this MVP, use the <b>Developer Access</b> to test all features immediately.
                </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
               <Shield size={20} />
             </div>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Verified</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
               <Sparkles size={20} />
             </div>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">AI Ready</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
               <UserIcon size={20} />
             </div>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Personal</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
