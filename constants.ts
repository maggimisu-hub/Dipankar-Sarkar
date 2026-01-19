
import { Team, Match } from './types';

export const TEAMS: Team[] = [
  { id: 1, name: 'Tholu / Lucky' },
  { id: 2, name: 'Rohit / Kalu' },
  { id: 3, name: 'Lily / Aman' },
  { id: 4, name: 'Giridhar / Priyanshu' }
];

// Standard Round Robin (6 matches)
// Initial order based on user request (1-2, 1-3, 1-4, 2-3, 2-4, 3-4)
export const INITIAL_MATCHES: Match[] = [
  { id: 1, teamAId: 1, teamBId: 2, winnerId: null }, // Tholu / Lucky vs Rohit / Kalu
  { id: 2, teamAId: 1, teamBId: 3, winnerId: null }, // Tholu / Lucky vs Lily / Aman
  { id: 3, teamAId: 1, teamBId: 4, winnerId: null }, // Tholu / Lucky vs Giridhar / Priyanshu
  { id: 4, teamAId: 2, teamBId: 3, winnerId: null }, // Rohit / Kalu vs Lily / Aman
  { id: 5, teamAId: 2, teamBId: 4, winnerId: null }, // Rohit / Kalu vs Giridhar / Priyanshu
  { id: 6, teamAId: 3, teamBId: 4, winnerId: null }  // Lily / Aman vs Giridhar / Priyanshu
];
