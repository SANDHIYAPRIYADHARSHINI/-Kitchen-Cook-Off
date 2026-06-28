'use client';
import { useState } from 'react';
import { useContestStore } from '../store/contestStore';
import { Sun, Moon, Flame } from 'lucide-react';

interface NavItem {
  id: 'dashboard' | 'participants' | 'submissions' | 'leaderboard';
  label: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Kitchen HQ' },
  { id: 'participants', label: 'Chefs' },
  { id: 'submissions', label: 'Dishes' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

function CookerButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm group
        ${isActive
          ? 'text-orange-400'
          : 'text-current opacity-70 hover:opacity-100'
        }`}
    >
      {/* Cooker SVG */}
      <div className="relative w-10 h-8">
        {/* Lid - lifts on hover */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-out"
          style={{ top: hovered ? '-10px' : '-2px' }}
        >
          <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
            {/* Lid handle */}
            <rect x="14" y="0" width="8" height="4" rx="2"
              fill={isActive ? '#F97316' : '#9CA3AF'}
            />
            {/* Lid body */}
            <path d="M2 14 Q18 4 34 14 Z"
              fill={isActive ? '#FB923C' : '#6B7280'}
            />
            {/* Steam when hovered */}
            {hovered && (
              <>
                <text x="12" y="-4" fontSize="8" fill="#94A3B8" className="animate-bounce">~</text>
                <text x="18" y="-6" fontSize="8" fill="#94A3B8">~</text>
              </>
            )}
          </svg>
        </div>

        {/* Cooker pot body */}
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {/* Pot body */}
          <rect x="4" y="8" width="32" height="16" rx="4"
            fill={isActive ? '#F97316' : '#4B5563'}
            stroke={isActive ? '#EA580C' : '#374151'}
            strokeWidth="1"
          />
          {/* Handles */}
          <rect x="0" y="10" width="5" height="8" rx="2"
            fill={isActive ? '#EA580C' : '#374151'}
          />
          <rect x="35" y="10" width="5" height="8" rx="2"
            fill={isActive ? '#EA580C' : '#374151'}
          />
          {/* Shine */}
          <rect x="8" y="11" width="6" height="2" rx="1" fill="white" opacity="0.2"/>
          {/* Active flame */}
          {isActive && (
            <>
              <text x="10" y="28" fontSize="10" fill="#FCD34D">🔥</text>
            </>
          )}
        </svg>
      </div>

      <span className="text-xs font-semibold tracking-wide">{label}</span>

      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-400" />
      )}
    </button>
  );
}

export default function Navbar() {
  const { theme, toggleTheme, activeTab, setActiveTab, isFrozen, toggleFreeze, contestStatus } = useContestStore();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b backdrop-blur-md
        ${theme === 'dark'
          ? 'bg-gray-900/90 border-gray-700'
          : 'bg-amber-50/90 border-amber-200'
        }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="text-2xl">🍳</div>
        <div>
          <div className={`font-black text-lg tracking-tight ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
            Kitchen Cook-Off
          </div>
          <div className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-amber-600'}`}>
            CodeChef VIT · Contest Control Center
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        {navItems.map(item => (
          <CookerButton
            key={item.id}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Contest status pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
          ${contestStatus === 'Live'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${contestStatus === 'Live' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          {contestStatus}
        </div>

        {/* Freeze toggle */}
        <button
          onClick={toggleFreeze}
          title={isFrozen ? 'Unfreeze Leaderboard' : 'Freeze Leaderboard'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
            ${isFrozen
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
              : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                : 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'
            }`}
        >
          {isFrozen ? '🧊 Frozen' : '🔓 Freeze'}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg border transition-all
            ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-yellow-400 hover:bg-gray-600'
              : 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200'
            }`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}
