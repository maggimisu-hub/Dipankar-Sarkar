
import React from 'react';
import { TeamStats } from '../types';

interface PointsTableProps {
  stats: TeamStats[];
  championId: number | null;
}

const PointsTable: React.FC<PointsTableProps> = ({ stats, championId }) => {
  const sortedStats = [...stats].sort((a, b) => b.points - a.points || a.teamId - b.teamId);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Live Standings</h2>
          <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Round Robin</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[300px]">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 uppercase text-[10px] font-black tracking-wider">
                <th className="px-6 py-4">Team</th>
                <th className="px-4 py-4 text-center">Played</th>
                <th className="px-4 py-4 text-center text-green-600">Wins</th>
                <th className="px-4 py-4 text-center text-red-400">Losses</th>
                <th className="px-6 py-4 text-center bg-indigo-50/50 text-indigo-700">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStats.map((team, idx) => {
                const isChampion = team.teamId === championId;
                return (
                  <tr key={team.teamId} className={`hover:bg-slate-50 transition-colors ${isChampion ? 'bg-yellow-50/50' : ''}`}>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300 font-mono text-xs">{isChampion ? '👑' : `#${idx + 1}`}</span>
                        <span>{team.teamName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-500 text-sm">{team.played}</td>
                    <td className="px-4 py-4 text-center text-green-600 font-bold text-sm">{team.wins}</td>
                    <td className="px-4 py-4 text-center text-red-300 text-sm">{team.losses}</td>
                    <td className={`px-6 py-4 text-center font-black text-lg ${isChampion ? 'text-yellow-700 bg-yellow-100/30' : 'text-indigo-700 bg-indigo-50/30'}`}>
                      {team.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PointsTable;
