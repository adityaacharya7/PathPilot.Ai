
import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Check, Copy } from 'lucide-react';
import { improveResumeBullet } from '../services/geminiService';
import { useUser } from '../App';

const ResumeBuilder: React.FC = () => {
  const { user } = useUser();
  const [bullets, setBullets] = useState<string[]>([
    "Worked on a React project.",
    "Handled some database stuff."
  ]);
  const [improvingIdx, setImprovingIdx] = useState<number | null>(null);

  const handleImprove = async (idx: number) => {
    setImprovingIdx(idx);
    try {
      // Fixed: Now passing user's targetRole as the required second argument
      const improved = await improveResumeBullet(bullets[idx], user?.targetRole || 'Software Engineer');
      const newBullets = [...bullets];
      newBullets[idx] = improved;
      setBullets(newBullets);
    } catch (err) {
      console.error(err);
    } finally {
      setImprovingIdx(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Smart Resume Builder</h1>
          <p className="text-gray-500">Optimize your resume with AI and increase your ATS score.</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Copy size={18} /> Export PDF
        </button>
      </header>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Editor Side */}
        <section className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
              <Sparkles size={20} /> AI Bullet Point Enhancer
            </h2>
            <div className="space-y-6">
              {bullets.map((bullet, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bullet {idx + 1}</label>
                    <button 
                      onClick={() => handleImprove(idx)}
                      disabled={improvingIdx !== null}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                      {improvingIdx === idx ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Improve with AI
                    </button>
                  </div>
                  <textarea
                    className="w-full p-4 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm leading-relaxed min-h-[100px]"
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
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all"
              >
                + Add Experience Bullet
              </button>
            </div>
          </div>
        </section>

        {/* Live Preview Side */}
        <section className="bg-white p-12 rounded-2xl border shadow-lg h-fit sticky top-8">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center border-b pb-8">
              <h2 className="text-3xl font-serif font-bold uppercase tracking-widest text-gray-800">Alex Smith</h2>
              <p className="text-sm text-gray-500 mt-2">New York, NY | +1 234 567 8900 | alex@email.com</p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase border-b border-gray-900 pb-1 mb-4">Professional Experience</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">Software Engineering Intern</h4>
                    <span className="text-xs italic">May 2024 – Present</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Tech Solutions Inc. | SF, CA</p>
                  <ul className="list-disc ml-4 space-y-2">
                    {bullets.map((b, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed font-serif">{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t">
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800">ATS Readiness Score</p>
                    <p className="text-xs text-green-600">Your resume is optimized for SDE roles.</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-green-700">88%</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumeBuilder;
