'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useContestStore } from '../store/contestStore';
import { Search, RotateCcw } from 'lucide-react';
import { Verdict } from '../types';

const VERDICTS: Verdict[] = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Pending', 'Running'];

const verdictColor: Record<Verdict, string> = {
  'Accepted': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Wrong Answer': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Time Limit Exceeded': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Runtime Error': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Pending': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Running': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const verdictEmoji: Record<Verdict, string> = {
  'Accepted': '✅', 'Wrong Answer': '❌', 'Time Limit Exceeded': '⏰',
  'Runtime Error': '💥', 'Pending': '⏳', 'Running': '🔄',
};

function CustomDropdown({ value, onChange, options, theme }: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  theme: 'dark' | 'light';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm min-w-[160px]
          ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-amber-300 text-gray-800'}`}>
        <span>{options.find(o => o.value === value)?.label ?? value}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={`absolute top-full left-0 mt-1 w-full rounded-xl border shadow-xl z-50 overflow-hidden
          ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-amber-200'}`}>
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm
                ${value === opt.value ? 'bg-orange-500/20 text-orange-400 font-semibold' : theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-amber-50'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Submissions() {
  const { submissions, problems, rejudgeSubmission, undoLastRejudge, lastRejudge, theme } = useContestStore();
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('All');
  const [problemFilter, setProblemFilter] = useState('All');
  const [rejudgeId, setRejudgeId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = [...submissions];
    if (search) data = data.filter(s => s.participantName.toLowerCase().includes(search.toLowerCase()) || s.problemName.toLowerCase().includes(search.toLowerCase()));
    if (verdictFilter !== 'All') data = data.filter(s => s.verdict === verdictFilter);
    if (problemFilter !== 'All') data = data.filter(s => s.problemId === problemFilter);
    return data;
  }, [submissions, search, verdictFilter, problemFilter]);

  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-200';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputCls = `px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-400/50 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-amber-300 text-gray-800 placeholder-gray-400'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-black ${textMain}`}>🍽️ Dish Monitor</h1>
          <p className={`text-sm mt-1 ${textMuted}`}>{submissions.length} total submissions · click any row to rejudge</p>
        </div>
        {lastRejudge && (
          <button
            onClick={undoLastRejudge}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
          >
            <RotateCcw size={14} /> Undo Last Rejudge
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={`rounded-2xl p-5 border flex flex-wrap gap-4 ${cardBg}`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input className={`${inputCls} pl-8 w-full`} placeholder="Search by chef or dish..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <CustomDropdown
  value={verdictFilter}
  onChange={setVerdictFilter}
  options={[{ label: 'All Verdicts', value: 'All' }, ...VERDICTS.map(v => ({ label: v, value: v }))]}
  theme={theme}
/>
<CustomDropdown
  value={problemFilter}
  onChange={setProblemFilter}
  options={[{ label: 'All Dishes', value: 'All' }, ...problems.map(p => ({ label: p.name, value: p.id }))]}
  theme={theme}
/>
      </div>

      {/* Verdict summary chips */}
      <div className="flex flex-wrap gap-2">
        {VERDICTS.map(v => {
          const count = submissions.filter(s => s.verdict === v).length;
          return (
            <button
              key={v}
              onClick={() => setVerdictFilter(verdictFilter === v ? 'All' : v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${verdictColor[v]} ${verdictFilter === v ? 'ring-2 ring-orange-400' : ''}`}
            >
              {verdictEmoji[v]} {v} <span className="font-black">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'}>
            <tr>
              {['Chef', 'Dish', 'Time', 'Verdict', 'Language', 'Actions'].map(h => (
                <th key={h} className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${textMuted}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className={`border-t transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/30' : 'border-amber-100 hover:bg-amber-50'}`}>
                <td className={`px-4 py-3 text-sm font-semibold ${textMain}`}>{s.participantName}</td>
                <td className={`px-4 py-3 text-sm ${textMuted}`}>{s.problemName}</td>
                <td className={`px-4 py-3 text-xs font-mono ${textMuted}`}>{new Date(s.submissionTime).toLocaleTimeString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${verdictColor[s.verdict]}`}>
                    {verdictEmoji[s.verdict]} {s.verdict}
                  </span>
                </td>
                <td className={`px-4 py-3 text-xs font-mono ${textMain}`}>{s.language}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setRejudgeId(rejudgeId === s.id ? null : s.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-orange-50 hover:border-orange-300'}`}
                  >
                    ⚖️ Rejudge
                  </button>
                  {rejudgeId === s.id && (
                    <div className={`mt-2 p-2 rounded-xl border flex flex-wrap gap-1 ${theme === 'dark' ? 'bg-gray-900 border-gray-600' : 'bg-amber-50 border-amber-200'}`}>
                      {VERDICTS.filter(v => v !== s.verdict).map(v => (
                        <button
                          key={v}
                          onClick={() => { rejudgeSubmission(s.id, v); setRejudgeId(null); }}
                          className={`text-xs px-2 py-1 rounded-lg border font-semibold transition-all hover:scale-105 ${verdictColor[v]}`}
                        >
                          {verdictEmoji[v]} {v}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={`px-4 py-12 text-center text-sm ${textMuted}`}>
                  🍽️ No dishes match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
