'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useContestStore } from '../store/contestStore';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Participant } from '../types';

type SortKey = keyof Pick<Participant, 'rank' | 'name' | 'institution' | 'problemsSolved' | 'penaltyTime'>;

function CustomDropdown({ value, onChange, options, theme }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
        <span>{value}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={`absolute top-full left-0 mt-1 w-full rounded-xl border shadow-xl z-50 overflow-hidden
          ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-amber-200'}`}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm
                ${value === opt ? 'bg-orange-500/20 text-orange-400 font-semibold' : theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-amber-50'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Participants() {
  const { participants, theme } = useContestStore();
  const [search, setSearch] = useState('');
  const [institution, setInstitution] = useState('All');
  const [minSolved, setMinSolved] = useState(0);
  const [maxRank, setMaxRank] = useState(100);
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const institutions = ['All', ...Array.from(new Set(participants.map(p => p.institution)))];

  const filtered = useMemo(() => {
    let data = [...participants];
    if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (institution !== 'All') data = data.filter(p => p.institution === institution);
    data = data.filter(p => p.problemsSolved >= minSolved && p.rank <= maxRank);
    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'string' && typeof vb === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return data;
  }, [participants, search, institution, minSolved, maxRank, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp size={10} className={sortKey === k && sortDir === 'asc' ? 'text-orange-400' : 'opacity-30'} />
      <ChevronDown size={10} className={sortKey === k && sortDir === 'desc' ? 'text-orange-400' : 'opacity-30'} />
    </span>
  );

  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-200';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputCls = `px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-400/50 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-amber-300 text-gray-800 placeholder-gray-400'}`;
  const thCls = `px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none ${textMuted} hover:text-orange-400 transition-colors`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-black ${textMain}`}>👨‍🍳 Chef Roster</h1>
        <p className={`text-sm mt-1 ${textMuted}`}>All {participants.length} contestants · filter, sort & search</p>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl p-5 border flex flex-wrap gap-4 ${cardBg}`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input className={`${inputCls} pl-8 w-full`} placeholder="Search chefs..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <CustomDropdown value={institution} onChange={(v) => { setInstitution(v); setPage(1); }} options={institutions} theme={theme} />
        <div className="flex items-center gap-2">
          <label className={`text-xs font-semibold ${textMuted}`}>Min solved</label>
          <input type="number" min={0} max={5} value={minSolved} onChange={e => { setMinSolved(+e.target.value); setPage(1); }} className={`${inputCls} w-16`} />
        </div>
        <div className="flex items-center gap-2">
          <label className={`text-xs font-semibold ${textMuted}`}>Max rank</label>
          <input type="number" min={1} max={100} value={maxRank} onChange={e => { setMaxRank(+e.target.value); setPage(1); }} className={`${inputCls} w-16`} />
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'}>
            <tr>
              <th className={thCls} onClick={() => sort('rank')}>#<SortIcon k="rank" /></th>
              <th className={thCls} onClick={() => sort('name')}>Chef<SortIcon k="name" /></th>
              <th className={thCls} onClick={() => sort('institution')}>Kitchen<SortIcon k="institution" /></th>
              <th className={thCls} onClick={() => sort('problemsSolved')}>Dishes Solved<SortIcon k="problemsSolved" /></th>
              <th className={thCls} onClick={() => sort('penaltyTime')}>Penalty<SortIcon k="penaltyTime" /></th>
              <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${textMuted}`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p, i) => (
              <tr
                key={p.id}
                className={`border-t transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/30' : 'border-amber-100 hover:bg-amber-50'}`}
              >
                <td className="px-4 py-3">
                  <span className={`font-black text-sm ${p.rank <= 3 ? 'text-orange-400' : textMuted}`}>
                    {p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank - 1] : `#${p.rank}`}
                  </span>
                </td>
                <td className={`px-4 py-3 font-semibold text-sm ${textMain}`}>{p.name}</td>
                <td className={`px-4 py-3 text-sm ${textMuted}`}>{p.institution}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-orange-400">{p.problemsSolved}</span>
                  <span className={`text-xs ml-1 ${textMuted}`}>/ 5</span>
                </td>
                <td className={`px-4 py-3 text-sm font-mono ${textMain}`}>{p.penaltyTime} min</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.contestStatus === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.contestStatus}
                  </span>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className={`px-4 py-12 text-center text-sm ${textMuted}`}>
                  🍽️ No chefs match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={`flex items-center justify-between px-4 py-3 border-t text-sm ${theme === 'dark' ? 'border-gray-700' : 'border-amber-100'}`}>
          <span className={textMuted}>{filtered.length} chefs found</span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${page === p ? 'bg-orange-500 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
