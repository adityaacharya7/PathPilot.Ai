import React, { useState } from 'react';
import { Calendar, AlertTriangle, Target, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generatePrepPlan } from '../services/geminiService';
import { PrepPlan } from '../types';

const PrepPlanner: React.FC = () => {
  const [role, setRole] = useState('SDE');
  const [days, setDays] = useState(30);
  const [level, setLevel] = useState('Beginner');
  const [plan, setPlan] = useState<PrepPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generatePrepPlan(role, days, level);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Time-Based Placement Planner</h1>
        <p className="text-gray-500">Custom prep strategies based on your target role and timeline.</p>
      </header>

      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white p-8 rounded-2xl border shadow-sm grid md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Target Role</label>
            <select 
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="SDE">SDE / Software Engineer</option>
              <option value="Analyst">Data Analyst</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Core Engineering">Core Engineer</option>
              <option value="MBA">Management / MBA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Time Left</label>
            <select 
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={30}>30 Days (Intensive)</option>
              <option value={60}>60 Days (Steady)</option>
              <option value={90}>90 Days (Thorough)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Current Level</label>
            <select 
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (Starting now)</option>
              <option value="Intermediate">Intermediate (Know basics)</option>
              <option value="Advanced">Advanced (Need revision)</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-lg shadow-lg disabled:bg-indigo-400"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate My Prep Plan
            </button>
          </div>
        </div>
      </div>

      {plan && (
        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-indigo-600" /> Daily Plan
              </h2>
              <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown>{plan.dailyPlan}</ReactMarkdown>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-l-4 border-l-green-500 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="text-green-600" /> Weekly Milestones
              </h2>
              <ul className="space-y-4">
                {plan.milestones.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs flex-shrink-0">
                      {i + 1}
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-red-700 flex items-center gap-2">
                <AlertTriangle className="text-red-600" /> Risk Alerts
              </h2>
              <ul className="space-y-3">
                {plan.riskAlerts.map((r, i) => (
                  <li key={i} className="text-sm text-red-600 flex gap-2">
                    • {r}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrepPlanner;