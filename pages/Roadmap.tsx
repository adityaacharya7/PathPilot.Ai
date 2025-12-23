
import React, { useState } from 'react';
import { Map, ExternalLink, PlayCircle, Book, Loader2, RefreshCcw } from 'lucide-react';
import { generateRoadmap } from '../services/geminiService';
import { RoadmapNode } from '../types';

const Roadmap: React.FC = () => {
  const [role, setRole] = useState('Frontend Developer');
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const data = await generateRoadmap(role);
      setNodes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Dynamic Skill Roadmap</h1>
        <p className="text-gray-500">Tailored learning paths based on your resume and placement goals.</p>
      </header>

      <div className="flex gap-4 mb-12">
        <input 
          type="text" 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter target role (e.g. Backend Engineer)"
          className="flex-1 p-4 border rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={fetchRoadmap}
          disabled={loading}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:bg-indigo-400"
        >
          {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw size={18} />}
          Generate Roadmap
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-12 relative">
          {nodes.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-gray-400">
              <Map className="mx-auto mb-4 opacity-50" size={48} />
              Enter a role and click generate to see your custom path.
            </div>
          )}
          
          {nodes.map((node, idx) => (
            <div key={idx} className="flex gap-10 group">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm group-hover:border-indigo-500 transition-colors z-10 flex-shrink-0">
                {idx + 1}
              </div>
              <div className="bg-white p-6 rounded-2xl border shadow-sm flex-1 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-4">{node.topic}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {node.resources.map((res, rid) => (
                    <a 
                      key={rid} 
                      href={res.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group/link"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-indigo-600">
                          {res.name.toLowerCase().includes('youtube') ? <PlayCircle size={20} /> : <Book size={20} />}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{res.name}</span>
                      </div>
                      <ExternalLink size={14} className="text-gray-400 group-hover/link:text-indigo-600" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
