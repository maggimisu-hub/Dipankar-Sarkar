
export interface Team {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  teamAId: number;
  teamBId: number;
  winnerId: number | null; // null means pending
}

export interface TeamStats {
  teamId: number;
  teamName: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
}

export interface RankingEntry extends TeamStats {
  rank: number;
  qualified: boolean;
}

export enum Screen {
  Dashboard = 'Dashboard',
  MatchEntry = 'MatchEntry',
  PointsTable = 'PointsTable',
  Rankings = 'Rankings',
  Semifinals = 'Semifinals'
}
