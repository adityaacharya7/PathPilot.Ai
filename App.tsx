
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Layout, Briefcase, MessageSquare, Map, FileText, Settings, BarChart, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { UserProfile } from './types';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InternshipPortal from './pages/InternshipPortal';
import AdvisorChat from './pages/AdvisorChat';
import PrepPlanner from './pages/PrepPlanner';
import Roadmap from './pages/Roadmap';
import ResumeBuilder from './pages/ResumeBuilder';
import AdminPanel from './pages/AdminPanel';
import ProfileSetup from './pages/ProfileSetup';

// Contexts
const ThemeContext = createContext({ isDark: false, toggle: () => {} });
const UserContext = createContext<{ 
  user: UserProfile | null, 
  login: (u: UserProfile) => void, 
  logout: () => void,
  updateProfile: (u: UserProfile) => void
}>({ 
  user: null, 
  login: () => {}, 
  logout: () => {}, 
  updateProfile: () => {} 
});

export const useTheme = () => useContext(ThemeContext);
export const useUser = () => useContext(UserContext);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const { user, logout } = useUser();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Layout, label: 'Dashboard' },
    { path: '/internships', icon: Briefcase, label: 'Opportunities' },
    { path: '/advisor', icon: MessageSquare, label: 'AI Advisor' },
    { path: '/planner', icon: Settings, label: 'Prep Planner' },
    { path: '/roadmap', icon: Map, label: 'Skill Roadmap' },
    { path: '/resume', icon: FileText, label: 'Resume Builder' },
    { path: '/admin', icon: BarChart, label: 'Admin Panel' },
  ];

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/profile-setup') return null;

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 h-screen sticky top-0 flex flex-col transition-colors">
      <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm">PP</div>
          PathPilot
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t dark:border-slate-800 space-y-4">
        <button 
          onClick={toggle}
          className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-300">
               {user?.avatar ? <img src={user.avatar} className="rounded-full" /> : <UserIcon size={16} />}
             </div>
             <div className="truncate">
                <p className="text-xs font-bold truncate dark:text-white">{user?.name || 'Guest'}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.targetRole || 'Explorer'}</p>
             </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Fixed: children is made optional to resolve TypeScript "children is missing" error when wrapping Route elements
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const login = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  }

  return (
    <UserContext.Provider value={{ user, login, logout, updateProfile }}>
      <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(!isDark) }}>
        <Router>
          <div className="flex min-h-screen transition-colors">
            <Sidebar />
            <main className="flex-1 bg-gray-50 dark:bg-slate-950 overflow-auto">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="/internships" element={<ProtectedRoute><InternshipPortal /></ProtectedRoute>} />
                <Route path="/advisor" element={<ProtectedRoute><AdvisorChat /></ProtectedRoute>} />
                <Route path="/planner" element={<ProtectedRoute><PrepPlanner /></ProtectedRoute>} />
                <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
