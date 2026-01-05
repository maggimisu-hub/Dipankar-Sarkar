
import { Team, Match } from './types';

export const TEAMS: Team[] = [
  { id: 1, name: 'Lily / Priyanshu' },
  { id: 2, name: 'Kalu / Tholu' },
  { id: 3, name: 'Rohit / Gridhar' },
  { id: 4, name: 'Lucky / Satish' },
  { id: 5, name: 'Shanu / Aman' }
];

// Fixed Round Robin Order (10 matches)
export const INITIAL_MATCHES: Match[] = [
  { id: 1, teamAId: 1, teamBId: 3, winnerId: null }, // Lily / Priyanshu vs Rohit / Gridhar
  { id: 2, teamAId: 4, teamBId: 2, winnerId: null }, // Lucky / Satish vs Kalu / Tholu
  { id: 3, teamAId: 1, teamBId: 5, winnerId: null }, // Lily / Priyanshu vs Shanu / Aman
  { id: 4, teamAId: 3, teamBId: 2, winnerId: null }, // Rohit / Gridhar vs Kalu / Tholu
  { id: 5, teamAId: 4, teamBId: 5, winnerId: null }, // Lucky / Satish vs Shanu / Aman
  { id: 6, teamAId: 1, teamBId: 4, winnerId: null }, // Lily / Priyanshu vs Lucky / Satish
  { id: 7, teamAId: 2, teamBId: 5, winnerId: null }, // Kalu / Tholu vs Shanu / Aman
  { id: 8, teamAId: 3, teamBId: 4, winnerId: null }, // Rohit / Gridhar vs Lucky / Satish
  { id: 9, teamAId: 1, teamBId: 2, winnerId: null }, // Lily / Priyanshu vs Kalu / Tholu
  { id: 10, teamAId: 3, teamBId: 5, winnerId: null } // Rohit / Gridhar vs Shanu / Aman
];
