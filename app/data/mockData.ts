import { Participant, Problem, Submission, Activity } from '../types';

export const mockProblems: Problem[] = [
  { id: 'p1', name: 'Binary Soup', code: 'BSOUP', difficulty: 'Easy', totalSubmissions: 342, acceptedSubmissions: 210 },
  { id: 'p2', name: 'Chef\'s Graph', code: 'CGRAPH', difficulty: 'Medium', totalSubmissions: 198, acceptedSubmissions: 89 },
  { id: 'p3', name: 'Spicy Strings', code: 'SPSTR', difficulty: 'Easy', totalSubmissions: 289, acceptedSubmissions: 175 },
  { id: 'p4', name: 'Pressure Cooker DP', code: 'PCDP', difficulty: 'Hard', totalSubmissions: 120, acceptedSubmissions: 34 },
  { id: 'p5', name: 'Ladle Sort', code: 'LSORT', difficulty: 'Medium', totalSubmissions: 221, acceptedSubmissions: 110 },
];

export const mockParticipants: Participant[] = [
  { id: 'u1', name: 'Aryan Sharma', institution: 'VIT Vellore', rank: 1, problemsSolved: 5, penaltyTime: 120, contestStatus: 'Active', country: 'India' },
  { id: 'u2', name: 'Priya Nair', institution: 'IIT Madras', rank: 2, problemsSolved: 5, penaltyTime: 145, contestStatus: 'Active', country: 'India' },
  { id: 'u3', name: 'Rohan Mehta', institution: 'BITS Pilani', rank: 3, problemsSolved: 4, penaltyTime: 98, contestStatus: 'Active', country: 'India' },
  { id: 'u4', name: 'Sneha Rao', institution: 'VIT Vellore', rank: 4, problemsSolved: 4, penaltyTime: 134, contestStatus: 'Active', country: 'India' },
  { id: 'u5', name: 'Karan Patel', institution: 'NIT Trichy', rank: 5, problemsSolved: 3, penaltyTime: 78, contestStatus: 'Active', country: 'India' },
  { id: 'u6', name: 'Diya Krishnan', institution: 'IIT Bombay', rank: 6, problemsSolved: 3, penaltyTime: 90, contestStatus: 'Active', country: 'India' },
  { id: 'u7', name: 'Aditya Kumar', institution: 'VIT Vellore', rank: 7, problemsSolved: 3, penaltyTime: 112, contestStatus: 'Active', country: 'India' },
  { id: 'u8', name: 'Meera Iyer', institution: 'IIIT Hyderabad', rank: 8, problemsSolved: 2, penaltyTime: 60, contestStatus: 'Active', country: 'India' },
  { id: 'u9', name: 'Ravi Teja', institution: 'NIT Warangal', rank: 9, problemsSolved: 2, penaltyTime: 75, contestStatus: 'Active', country: 'India' },
  { id: 'u10', name: 'Ananya Singh', institution: 'IIT Delhi', rank: 10, problemsSolved: 2, penaltyTime: 88, contestStatus: 'Active', country: 'India' },
  { id: 'u11', name: 'Vikram Bose', institution: 'BITS Goa', rank: 11, problemsSolved: 2, penaltyTime: 95, contestStatus: 'Active', country: 'India' },
  { id: 'u12', name: 'Pooja Verma', institution: 'VIT Chennai', rank: 12, problemsSolved: 1, penaltyTime: 30, contestStatus: 'Active', country: 'India' },
  { id: 'u13', name: 'Nikhil Das', institution: 'IIT Kharagpur', rank: 13, problemsSolved: 1, penaltyTime: 45, contestStatus: 'Active', country: 'India' },
  { id: 'u14', name: 'Tanvi Joshi', institution: 'NIT Surathkal', rank: 14, problemsSolved: 1, penaltyTime: 58, contestStatus: 'Active', country: 'India' },
  { id: 'u15', name: 'Aman Gupta', institution: 'VIT Vellore', rank: 15, problemsSolved: 0, penaltyTime: 0, contestStatus: 'Active', country: 'India' },
];

export const mockSubmissions: Submission[] = [
  { id: 's1', participantId: 'u1', participantName: 'Aryan Sharma', problemId: 'p1', problemName: 'Binary Soup', submissionTime: '2024-03-15T10:05:00', verdict: 'Accepted', language: 'C++', timeTaken: 0.12 },
  { id: 's2', participantId: 'u2', participantName: 'Priya Nair', problemId: 'p1', problemName: 'Binary Soup', submissionTime: '2024-03-15T10:08:00', verdict: 'Accepted', language: 'Python', timeTaken: 0.45 },
  { id: 's3', participantId: 'u3', participantName: 'Rohan Mehta', problemId: 'p2', problemName: "Chef's Graph", submissionTime: '2024-03-15T10:15:00', verdict: 'Wrong Answer', language: 'Java', timeTaken: 0.33 },
  { id: 's4', participantId: 'u4', participantName: 'Sneha Rao', problemId: 'p3', problemName: 'Spicy Strings', submissionTime: '2024-03-15T10:20:00', verdict: 'Accepted', language: 'C++', timeTaken: 0.09 },
  { id: 's5', participantId: 'u5', participantName: 'Karan Patel', problemId: 'p4', problemName: 'Pressure Cooker DP', submissionTime: '2024-03-15T10:25:00', verdict: 'Time Limit Exceeded', language: 'C++', timeTaken: 2.0 },
  { id: 's6', participantId: 'u6', participantName: 'Diya Krishnan', problemId: 'p2', problemName: "Chef's Graph", submissionTime: '2024-03-15T10:30:00', verdict: 'Accepted', language: 'C++', timeTaken: 0.18 },
  { id: 's7', participantId: 'u7', participantName: 'Aditya Kumar', problemId: 'p5', problemName: 'Ladle Sort', submissionTime: '2024-03-15T10:35:00', verdict: 'Runtime Error', language: 'Python', timeTaken: 0.0 },
  { id: 's8', participantId: 'u8', participantName: 'Meera Iyer', problemId: 'p1', problemName: 'Binary Soup', submissionTime: '2024-03-15T10:40:00', verdict: 'Pending', language: 'Java', timeTaken: 0.0 },
  { id: 's9', participantId: 'u1', participantName: 'Aryan Sharma', problemId: 'p2', problemName: "Chef's Graph", submissionTime: '2024-03-15T10:45:00', verdict: 'Accepted', language: 'C++', timeTaken: 0.22 },
  { id: 's10', participantId: 'u9', participantName: 'Ravi Teja', problemId: 'p3', problemName: 'Spicy Strings', submissionTime: '2024-03-15T10:50:00', verdict: 'Running', language: 'C++', timeTaken: 0.0 },
  { id: 's11', participantId: 'u10', participantName: 'Ananya Singh', problemId: 'p5', problemName: 'Ladle Sort', submissionTime: '2024-03-15T10:55:00', verdict: 'Accepted', language: 'C++', timeTaken: 0.15 },
  { id: 's12', participantId: 'u11', participantName: 'Vikram Bose', problemId: 'p4', problemName: 'Pressure Cooker DP', submissionTime: '2024-03-15T11:00:00', verdict: 'Wrong Answer', language: 'Java', timeTaken: 0.88 },
  { id: 's13', participantId: 'u2', participantName: 'Priya Nair', problemId: 'p4', problemName: 'Pressure Cooker DP', submissionTime: '2024-03-15T11:05:00', verdict: 'Accepted', language: 'C++', timeTaken: 0.41 },
  { id: 's14', participantId: 'u3', participantName: 'Rohan Mehta', problemId: 'p1', problemName: 'Binary Soup', submissionTime: '2024-03-15T11:10:00', verdict: 'Accepted', language: 'Java', timeTaken: 0.67 },
  { id: 's15', participantId: 'u12', participantName: 'Pooja Verma', problemId: 'p3', problemName: 'Spicy Strings', submissionTime: '2024-03-15T11:15:00', verdict: 'Pending', language: 'Python', timeTaken: 0.0 },
];

export const mockActivities: Activity[] = [
  { id: 'a1', type: 'join', message: 'Aman Gupta joined the contest', timestamp: '2024-03-15T09:58:00' },
  { id: 'a2', type: 'submit', message: 'Aryan Sharma submitted Binary Soup', timestamp: '2024-03-15T10:05:00' },
  { id: 'a3', type: 'accept', message: 'Aryan Sharma\'s Binary Soup was Accepted!', timestamp: '2024-03-15T10:05:30' },
  { id: 'a4', type: 'submit', message: 'Priya Nair submitted Binary Soup', timestamp: '2024-03-15T10:08:00' },
  { id: 'a5', type: 'accept', message: 'Priya Nair\'s Binary Soup was Accepted!', timestamp: '2024-03-15T10:08:45' },
  { id: 'a6', type: 'submit', message: 'Rohan Mehta submitted Chef\'s Graph', timestamp: '2024-03-15T10:15:00' },
  { id: 'a7', type: 'submit', message: 'Sneha Rao submitted Spicy Strings', timestamp: '2024-03-15T10:20:00' },
  { id: 'a8', type: 'accept', message: 'Sneha Rao\'s Spicy Strings was Accepted!', timestamp: '2024-03-15T10:20:30' },
  { id: 'a9', type: 'rejudge', message: 'Submission #s3 was rejudged: Wrong Answer', timestamp: '2024-03-15T10:50:00' },
  { id: 'a10', type: 'freeze', message: 'Leaderboard has been frozen', timestamp: '2024-03-15T11:00:00' },
];

export const contestConfig = {
  name: "CodeChef Kitchen Cook-Off",
  status: "Live" as const,
  startTime: "2024-03-15T09:00:00",
  endTime: "2024-03-15T14:00:00",
  totalProblems: 5,
};
