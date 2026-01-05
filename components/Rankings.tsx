
import React from 'react';
import { RankingEntry, Match, Team } from '../types';

interface RankingsProps {
  rankings: RankingEntry[];
  hasCriticalTie: boolean;
  matches: Match[];
  teams: Team[];
  championId: number | null;
}

const Rankings: React.FC<RankingsProps> = ({ rankings, hasCriticalTie, matches, teams, championId }) => {
  return (
    <div className="space-y-8 pb-12">
      {hasCriticalTie && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl shadow-sm text-center animate-shake">
          <div className="text-3xl mb-2">⚖️</div>
          <h3 className="font-bold text-amber-900 uppercase tracking-tight">Tie Unresolved</h3>
          <p className="text-amber-700 text-sm mt-1 max-w-sm mx-auto">
            The wins are tied at the Rank 4 boundary. Please check the <strong>Head-to-Head Matrix</strong> below to verify if a winner is clear.
          </p>
        </div>
      )}
      
      {/* Rankings List */}
      <div className="grid grid-cols-1 gap-4">
        {rankings.map((team) => {
          const isChampion = team.teamId === championId;
          const isBoundaryTied = hasCriticalTie && (team.rank === 4 || team.rank === 5 || (rankings[3].points === team.points));
          
          return (
            <div key={team.teamId} className={`flex items-center p-6 rounded-xl border-2 transition-all ${isChampion ? 'bg-yellow-50 border-yellow-400 shadow-lg' : team.qualified ? 'bg-white border-green-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mr-6 ${isChampion ? 'bg-yellow-500 text-white' : team.qualified ? 'bg-green-600 text-white' : 'bg-slate-400 text-white'}`}>
                {isChampion ? '👑' : team.rank}
              </div>
              <div className="flex-grow">
                <h3 className={`font-bold text-lg truncate ${isChampion ? 'text-yellow-900' : 'text-slate-800'}`}>{team.teamName}</h3>
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Wins: {team.wins}</p>
              </div>
              <div className="text-right">
                {isChampion ? (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Winner</span>
                ) : isBoundaryTied ? (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-amber-200">Tie Pending</span>
                ) : team.qualified ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Qualified</span>
                ) : (
                  <span className="bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Eliminated</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Head-to-Head Matrix Visualizer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-12">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Head-to-Head Matrix</h3>
          <span className="text-[8px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded font-black uppercase tracking-widest">Transparency Tool</span>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-[10px] sm:text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="p-4 border-r bg-slate-100/50"></th>
                {teams.map(t => (
                  <th key={t.id} className="p-3 text-center font-black text-slate-400 uppercase tracking-tighter min-w-[80px]">
                    {t.name.split('/')[0].trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map(rowTeam => (
                <tr key={rowTeam.id} className="border-b">
                  <td className="p-3 font-black text-slate-600 uppercase border-r bg-slate-50/50">
                    {rowTeam.name.split('/')[0].trim()}
                  </td>
                  {teams.map(colTeam => {
                    if (rowTeam.id === colTeam.id) return <td key={colTeam.id} className="bg-slate-100/30"></td>;
                    
                    const match = matches.find(m => 
                      (m.teamAId === rowTeam.id && m.teamBId === colTeam.id) || 
                      (m.teamAId === colTeam.id && m.teamBId === rowTeam.id)
                    );
                    
                    if (!match || match.winnerId === null) {
                      return <td key={colTeam.id} className="text-center text-slate-200 font-bold p-4">—</td>;
                    }

                    const isRowWinner = match.winnerId === rowTeam.id;

                    return (
                      <td key={colTeam.id} className={`text-center p-3 transition-colors ${isRowWinner ? 'bg-green-50' : 'bg-red-50/30'}`}>
                        <div className={`font-black tracking-widest ${isRowWinner ? 'text-green-700' : 'text-red-300'}`}>
                          {isRowWinner ? 'WIN' : 'LOSS'}
                        </div>
                        <div className="text-[8px] font-bold text-slate-400 mt-0.5 opacity-50 uppercase">vs {colTeam.name.split('/')[0].trim()}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 text-center border-t">
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">
            How to read: Row Team result vs Column Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
