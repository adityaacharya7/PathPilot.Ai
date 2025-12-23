
import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Star } from 'lucide-react';
import { Internship } from '../types';

const MOCK_INTERNSHIPS: Internship[] = [
  { id: '1', company: 'Google', role: 'Software Engineering Intern', skills: ['C++', 'Java', 'Python'], difficulty: 'Hard', eligibleYear: 2025, isVerified: true, matchScore: 98 },
  { id: '2', company: 'Microsoft', role: 'Explore Intern', skills: ['C#', 'SQL'], difficulty: 'Medium', eligibleYear: 2026, isVerified: true, matchScore: 85 },
  { id: '3', company: 'Atlassian', role: 'Product Design Intern', skills: ['Figma', 'UX Research'], difficulty: 'Medium', eligibleYear: 2025, isVerified: true, matchScore: 45 },
  { id: '4', company: 'Stripe', role: 'Backend Engineer Intern', skills: ['Ruby', 'APIs'], difficulty: 'Hard', eligibleYear: 2025, isVerified: true, matchScore: 92 },
  { id: '5', company: 'Swiggy', role: 'Data Science Intern', skills: ['Python', 'ML', 'Tableau'], difficulty: 'Medium', eligibleYear: 2025, isVerified: true, matchScore: 70 },
];

const InternshipPortal: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_INTERNSHIPS
    .filter(item => item.role.toLowerCase().includes(search.toLowerCase()) || item.company.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verified Opportunities</h1>
          <p className="text-gray-500">Only verified internships from your placement cell, ranked by your best fit.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search roles or companies..."
              className="pl-10 pr-4 py-2 border rounded-xl w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50">
            <Filter size={18} /> Filter
          </button>
        </div>
      </header>

      <div className="grid gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600 border">
                  {item.company[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{item.role}</h3>
                    {item.isVerified && <ShieldCheck className="text-green-500" size={20} />}
                  </div>
                  <p className="text-gray-600 mb-4">{item.company}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-gray-100 text-xs font-semibold rounded-full text-gray-600 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between min-w-[200px]">
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-bold mb-2">
                    <Star size={14} fill="currentColor" /> {item.matchScore}% Match Score
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 mt-2">
                    <span>Year: {item.eligibleYear}</span>
                    <span>•</span>
                    <span className={item.difficulty === 'Hard' ? 'text-red-500' : 'text-orange-500'}>{item.difficulty}</span>
                  </div>
                </div>
                <button className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4 md:mt-0">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternshipPortal;
