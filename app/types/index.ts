export type Verdict = 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Pending' | 'Running';
export type ContestStatus = 'Upcoming' | 'Live' | 'Ended';

export interface Participant {
  id: string;
  name: string;
  institution: string;
  rank: number;
  problemsSolved: number;
  penaltyTime: number;
  contestStatus: 'Active' | 'Disqualified' | 'Withdrawn';
  country: string;
}

export interface Problem {
  id: string;
  name: string;
  code: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  totalSubmissions: number;
  acceptedSubmissions: number;
}

export interface Submission {
  id: string;
  participantId: string;
  participantName: string;
  problemId: string;
  problemName: string;
  submissionTime: string;
  verdict: Verdict;
  language: string;
  timeTaken: number;
}

export interface Activity {
  id: string;
  type: 'join' | 'submit' | 'rejudge' | 'freeze' | 'unfreeze' | 'accept';
  message: string;
  timestamp: string;
}
