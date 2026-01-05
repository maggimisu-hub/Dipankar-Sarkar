
import React from 'react';
import { RankingEntry, Match, Team } from '../types';

interface RankingsProps {
  rankings: RankingEntry[];
  hasCriticalTie: boolean;
  matches: Match[];
  teams: Team[];
  championId: number | null;
}

const Rankings: React.FC<RankingsProps> = ({ rankings, hasCriticalTie, championId }) => {
  return (
    <div className="space-y-8">
      {hasCriticalTie && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl shadow-sm text-center animate-shake">
          <div className="text-3xl mb-2">⚖️</div>
          <h3 className="font-bold text-amber-900 uppercase tracking-tight">Tie Unresolved</h3>
          <p className="text-amber-700 text-sm mt-1">Organizer decision required to break the tie at the qualification boundary.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {rankings.map((team) => {
          const isChampion = team.teamId === championId;
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
    </div>
  );
};

export default Rankings;
