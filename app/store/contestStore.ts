'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participant, Submission, Activity, Problem } from '../types';
import { mockParticipants, mockSubmissions, mockActivities, mockProblems, contestConfig } from '../data/mockData';

interface ContestStore {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Contest
  contestStatus: 'Upcoming' | 'Live' | 'Ended';
  isFrozen: boolean;
  toggleFreeze: () => void;

  // Data
  participants: Participant[];
  submissions: Submission[];
  activities: Activity[];
  problems: Problem[];

  // Frozen snapshot
  frozenLeaderboard: Participant[];

  // Actions
  rejudgeSubmission: (submissionId: string, newVerdict: Submission['verdict']) => void;
  addSubmission: (submission: Submission) => void;
  undoLastRejudge: () => void;
  lastRejudge: { submissionId: string; oldVerdict: Submission['verdict'] } | null;

  // Active tab
  activeTab: 'dashboard' | 'participants' | 'submissions' | 'leaderboard';
  setActiveTab: (tab: ContestStore['activeTab']) => void;
}

function recalcRanks(participants: Participant[], submissions: Submission[]): Participant[] {
  const stats: Record<string, { solved: number; penalty: number }> = {};
  participants.forEach(p => { stats[p.id] = { solved: 0, penalty: 0 }; });

  submissions.forEach(s => {
    if (s.verdict === 'Accepted' && stats[s.participantId]) {
      stats[s.participantId].solved += 1;
      const subTime = new Date(s.submissionTime).getTime();
      const startTime = new Date(contestConfig.startTime).getTime();
      stats[s.participantId].penalty += Math.floor((subTime - startTime) / 60000);
    }
  });

  const sorted = [...participants]
    .map(p => ({ ...p, problemsSolved: stats[p.id]?.solved ?? p.problemsSolved, penaltyTime: stats[p.id]?.penalty ?? p.penaltyTime }))
    .sort((a, b) => b.problemsSolved - a.problemsSolved || a.penaltyTime - b.penaltyTime)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return sorted;
}

export const useContestStore = create<ContestStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      contestStatus: 'Live',
      isFrozen: false,
      frozenLeaderboard: [],

      participants: mockParticipants,
      submissions: mockSubmissions,
      activities: mockActivities,
      problems: mockProblems,
      lastRejudge: null,
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      toggleFreeze: () => {
        const { isFrozen, participants, submissions } = get();
        if (!isFrozen) {
          const newActivity: Activity = { id: `a${Date.now()}`, type: 'freeze', message: 'Leaderboard has been frozen', timestamp: new Date().toISOString() };
          set({ isFrozen: true, frozenLeaderboard: [...participants], activities: [newActivity, ...get().activities] });
        } else {
          const recalculated = recalcRanks(participants, submissions);
          const newActivity: Activity = { id: `a${Date.now()}`, type: 'unfreeze', message: 'Leaderboard has been unfrozen & recalculated', timestamp: new Date().toISOString() };
          set({ isFrozen: false, frozenLeaderboard: [], participants: recalculated, activities: [newActivity, ...get().activities] });
        }
      },

      rejudgeSubmission: (submissionId, newVerdict) => {
        const { submissions, participants } = get();
        const sub = submissions.find(s => s.id === submissionId);
        if (!sub) return;
        const oldVerdict = sub.verdict;
        const updatedSubs = submissions.map(s => s.id === submissionId ? { ...s, verdict: newVerdict } : s);
        const recalculated = recalcRanks(participants, updatedSubs);
        const newActivity: Activity = { id: `a${Date.now()}`, type: 'rejudge', message: `${sub.participantName}'s ${sub.problemName} rejudged: ${newVerdict}`, timestamp: new Date().toISOString() };
        set({ submissions: updatedSubs, participants: recalculated, lastRejudge: { submissionId, oldVerdict }, activities: [newActivity, ...get().activities] });
      },

      undoLastRejudge: () => {
        const { lastRejudge, submissions, participants } = get();
        if (!lastRejudge) return;
        const updatedSubs = submissions.map(s => s.id === lastRejudge.submissionId ? { ...s, verdict: lastRejudge.oldVerdict } : s);
        const recalculated = recalcRanks(participants, updatedSubs);
        const newActivity: Activity = { id: `a${Date.now()}`, type: 'rejudge', message: `Rejudge undone`, timestamp: new Date().toISOString() };
        set({ submissions: updatedSubs, participants: recalculated, lastRejudge: null, activities: [newActivity, ...get().activities] });
      },

      addSubmission: (submission) => {
        const newActivity: Activity = { id: `a${Date.now()}`, type: 'submit', message: `${submission.participantName} submitted ${submission.problemName}`, timestamp: new Date().toISOString() };
        set(s => ({ submissions: [submission, ...s.submissions], activities: [newActivity, ...s.activities] }));
      },
    }),
    { name: 'codechef-kitchen-store', partialize: (s) => ({ theme: s.theme }) }
  )
);
