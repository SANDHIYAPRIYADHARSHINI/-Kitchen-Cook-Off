'use client';
import { useContestStore } from '../store/contestStore';

export default function Leaderboard() {
  const { participants, frozenLeaderboard, isFrozen, toggleFreeze, problems, submissions, theme } = useContestStore();
  const displayed = isFrozen ? frozenLeaderboard : participants;

  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-200';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';

  // Per-problem solved status per participant
  const solvedMap: Record<string, Set<string>> = {};
  submissions.forEach(s => {
    if (s.verdict === 'Accepted') {
      if (!solvedMap[s.participantId]) solvedMap[s.participantId] = new Set();
      solvedMap[s.participantId].add(s.problemId);
    }
  });

  const exportCSV = () => {
    const header = 'Rank,Name,Institution,Solved,Penalty\n';
    const rows = displayed.map(p => `${p.rank},${p.name},${p.institution},${p.problemsSolved},${p.penaltyTime}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leaderboard.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-black ${textMain}`}>🏆 Chef Rankings</h1>
          <p className={`text-sm mt-1 ${textMuted}`}>
            {isFrozen ? '🧊 Leaderboard is frozen — live submissions hidden from rankings' : 'Live rankings · auto-updates on every accepted submission'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className={`text-sm px-4 py-2 rounded-xl border font-semibold transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200'}`}
          >
            📥 Export CSV
          </button>
          <button
            onClick={toggleFreeze}
            className={`text-sm px-4 py-2 rounded-xl border font-semibold transition-colors ${isFrozen ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30'}`}
          >
            {isFrozen ? '🔓 Unfreeze & Recalculate' : '🧊 Freeze Leaderboard'}
          </button>
        </div>
      </div>

      {isFrozen && (
        <div className="rounded-2xl p-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold flex items-center gap-2">
          🧊 Freeze Mode Active — Rankings locked. New submissions are still being recorded but won't affect standings until you unfreeze.
        </div>
      )}

      {/* Problem headers */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className={`px-4 py-3 border-b text-xs font-bold ${theme === 'dark' ? 'bg-gray-700/50 border-gray-700' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex gap-4 items-center">
            <div className="w-12" />
            <div className={`flex-1 ${textMuted}`}>Chef</div>
            {problems.map(p => (
              <div key={p.id} className={`w-20 text-center ${textMuted} uppercase tracking-wider`} title={p.name}>{p.code}</div>
            ))}
            <div className={`w-24 text-center ${textMuted}`}>Solved</div>
            <div className={`w-24 text-center ${textMuted}`}>Penalty</div>
          </div>
        </div>

        <div className="divide-y divide-gray-700/50">
          {displayed.map((p, i) => (
            <div
              key={p.id}
              className={`px-4 py-4 flex gap-4 items-center transition-colors
                ${i === 0 ? theme === 'dark' ? 'bg-yellow-500/5' : 'bg-yellow-50' : ''}
                ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-amber-50/50'}`}
            >
              {/* Rank */}
              <div className="w-12 text-center">
                <span className={`text-lg font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : textMuted}`}>
                  {i < 3 ? ['🥇','🥈','🥉'][i] : `#${p.rank}`}
                </span>
              </div>

              {/* Name + institution */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${textMain}`}>{p.name}</p>
                <p className={`text-xs truncate ${textMuted}`}>{p.institution}</p>
              </div>

              {/* Per-problem status */}
              {problems.map(prob => {
                const solved = solvedMap[p.id]?.has(prob.id);
                const tried = submissions.some(s => s.participantId === p.id && s.problemId === prob.id);
                return (
                  <div key={prob.id} className="w-20 text-center">
                    {solved
                      ? <span className="text-green-400 font-bold text-lg" title="Solved">✅</span>
                      : tried
                        ? <span className="text-red-400 text-lg" title="Attempted">❌</span>
                        : <span className={`text-lg ${textMuted}`}>—</span>
                    }
                  </div>
                );
              })}

              {/* Totals */}
              <div className="w-24 text-center">
                <span className="text-orange-400 font-black text-lg">{p.problemsSolved}</span>
              </div>
              <div className={`w-24 text-center font-mono text-sm font-semibold ${textMain}`}>{p.penaltyTime} min</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {problems.map(p => {
          const pct = Math.round((p.acceptedSubmissions / p.totalSubmissions) * 100) || 0;
          return (
            <div key={p.id} className={`rounded-2xl p-4 border ${cardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-1`}>{p.code}</div>
              <div className={`text-sm font-semibold ${textMain} mb-2`}>{p.name}</div>
              <div className={`text-xs mb-1 ${textMuted}`}>{p.acceptedSubmissions}/{p.totalSubmissions} accepted</div>
              <div className={`w-full rounded-full h-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-amber-100'}`}>
                <div className="h-1.5 rounded-full bg-orange-400" style={{ width: `${pct}%` }} />
              </div>
              <div className={`text-xs mt-1 text-right ${textMuted}`}>{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
