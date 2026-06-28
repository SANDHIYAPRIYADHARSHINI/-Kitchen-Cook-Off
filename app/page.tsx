'use client';
import { useEffect } from 'react';
import { useContestStore } from './store/contestStore';
import CarrotCursor from './components/CarrotCursor';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Participants from './components/Participants';
import Submissions from './components/Submissions';
import Leaderboard from './components/Leaderboard';

export default function Home() {
  const { theme, activeTab } = useContestStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <main className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-amber-50 text-gray-900'}`}>
      <CarrotCursor />
      <Navbar />
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'participants' && <Participants />}
        {activeTab === 'submissions' && <Submissions />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </main>
  );
}
