'use client';
import { useEffect, useState } from 'react';
import { useContestStore } from '../store/contestStore';
import { contestConfig } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: number | string; sub?: string; color: string }) {
  const { theme } = useContestStore();
  return (
    <div className={`rounded-2xl p-5 border flex flex-col gap-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-200'}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{sub}</span>
      </div>
      <div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
    </div>
  );
}

function Countdown() {
  const { theme } = useContestStore();
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = new Date(contestConfig.endTime).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span>⏱️</span>
        <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Time Remaining</span>
      </div>
      <div className="flex gap-3 justify-center">
        {[['H', pad(timeLeft.h)], ['M', pad(timeLeft.m)], ['S', pad(timeLeft.s)]].map(([unit, val]) => (
          <div key={unit} className="flex flex-col items-center">
            <div className={`text-4xl font-black tabular-nums ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>{val}</div>
            <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const chartData = [
  { time: '9:00', submissions: 0 },
  { time: '9:30', submissions: 12 },
  { time: '10:00', submissions: 34 },
  { time: '10:30', submissions: 58 },
  { time: '11:00', submissions: 87 },
  { time: '11:30', submissions: 104 },
  { time: '12:00', submissions: 143 },
  { time: '12:30', submissions: 178 },
  { time: '13:00', submissions: 210 },
];

export default function Dashboard() {
  const { submissions, participants, activities, theme } = useContestStore();
  const accepted = submissions.filter(s => s.verdict === 'Accepted').length;
  const rejected = submissions.filter(s => !['Accepted', 'Pending', 'Running'].includes(s.verdict)).length;

  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-200';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-black ${textMain}`}>🍳 Kitchen HQ</h1>
        <p className={`text-sm mt-1 ${textMuted}`}>CodeChef VIT · Kitchen Cook-Off · Live Overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon="👨‍🍳" label="Total Chefs" value={participants.length} sub="Active" color="bg-green-500/20 text-green-400" />
        <StatCard icon="🍽️" label="Problems" value={5} sub="On Menu" color="bg-blue-500/20 text-blue-400" />
        <StatCard icon="📬" label="Total Dishes" value={submissions.length} sub="Submitted" color="bg-purple-500/20 text-purple-400" />
        <StatCard icon="✅" label="Accepted" value={accepted} sub="Served" color="bg-green-500/20 text-green-400" />
        <StatCard icon="❌" label="Rejected" value={rejected} sub="Failed" color="bg-red-500/20 text-red-400" />
        <Countdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className={`lg:col-span-2 rounded-2xl p-5 border ${cardBg}`}>
          <div className={`text-sm font-semibold mb-4 ${textMuted}`}>📈 Submission Activity</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  background: theme === 'dark' ? '#1F2937' : '#FFF',
                  border: '1px solid #F97316',
                  borderRadius: 8,
                  color: theme === 'dark' ? '#FFF' : '#111',
                  fontSize: 12
                }}
              />
              <Area type="monotone" dataKey="submissions" stroke="#F97316" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <div className={`text-sm font-semibold mb-4 ${textMuted}`}>🔔 Kitchen Activity</div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {activities.slice(0, 10).map(a => (
              <div key={a.id} className="flex items-start gap-2">
                <span className="text-base mt-0.5 shrink-0">
                  {a.type === 'join' ? '👋' : a.type === 'accept' ? '✅' : a.type === 'submit' ? '📨' : a.type === 'freeze' ? '🧊' : a.type === 'unfreeze' ? '🔓' : '⚖️'}
                </span>
                <div>
                  <p className={`text-xs font-medium leading-snug ${textMain}`}>{a.message}</p>
                  <p className={`text-xs ${textMuted}`}>{new Date(a.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 mini leaderboard */}
      <div className={`rounded-2xl p-5 border ${cardBg}`}>
        <div className={`text-sm font-semibold mb-4 ${textMuted}`}>🏆 Top 5 Chefs Right Now</div>
        <div className="space-y-2">
          {participants.slice(0, 5).map((p, i) => (
            <div key={p.id} className={`flex items-center gap-4 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'}`}>
              <span className={`text-xl font-black w-8 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : textMuted}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${textMain}`}>{p.name}</p>
                <p className={`text-xs ${textMuted}`}>{p.institution}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold text-orange-400`}>{p.problemsSolved} solved</p>
                <p className={`text-xs ${textMuted}`}>{p.penaltyTime} min penalty</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
