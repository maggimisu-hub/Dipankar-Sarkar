
import React, { useState } from 'react';
import { RankingEntry, Match, Team } from '../types';

interface RankingsProps {
  rankings: RankingEntry[];
  hasCriticalTie: boolean;
  matches: Match[];
  teams: Team[];
  onResolveTie: (teamId: number) => void;
  championId: number | null;
}

const ADMIN_PIN = "2024";

const Rankings: React.FC<RankingsProps> = ({ rankings, hasCriticalTie, matches, teams, onResolveTie, championId }) => {
  const [pin, setPin] = useState('');
  const [showTieBreakerControls, setShowTieBreakerControls] = useState(false);
  
  const isPinCorrect = pin === ADMIN_PIN;

  // Identify all teams sharing the boundary points value (contesting Rank 4/5)
  const boundaryPoints = rankings[3]?.points ?? -1;
  const tiedTeamsPool = rankings.filter(r => r.points === boundaryPoints);
  
  // Specific teams strictly at Rank 4 and 5 for the message
  const teamAtRank4 = rankings[3];
  const teamAtRank5 = rankings[4];

  return (
    <div className="space-y-6">
      {hasCriticalTie && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl shadow-sm space-y-4 animate-shake">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚖️</span>
            <div>
              <h3 className="font-bold text-amber-900 text-lg leading-tight">Critical Tie Resolution Needed</h3>
              <p className="text-amber-700 text-sm mt-1">
                Conflict between <strong>{teamAtRank4?.teamName}</strong> and <strong>{teamAtRank5?.teamName}</strong> (both with {boundaryPoints} points). 
                Admin must decide which team advances.
              </p>
            </div>
          </div>

          {!showTieBreakerControls ? (
            <button 
              onClick={() => setShowTieBreakerControls(true)}
              className="w-full bg-amber-600 text-white font-black py-3 rounded-xl hover:bg-amber-700 transition shadow-md shadow-amber-200 uppercase text-xs tracking-widest"
            >
              Open Admin Tie-Breaker
            </button>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-amber-200 animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 text-center">
                Enter Admin PIN to Unlock
              </label>
              <input
                type="password"
                value={pin}
                maxLength={4}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center text-xl tracking-[0.5em] font-bold p-2 bg-slate-50 border border-slate-200 rounded-lg mb-4 outline-none focus:border-indigo-500 transition-all"
              />
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Select Team to Advance</p>
                <div className="grid grid-cols-1 gap-2">
                  {tiedTeamsPool.map((team) => (
                    <button
                      key={team.teamId}
                      disabled={!isPinCorrect}
                      onClick={() => {
                        onResolveTie(team.teamId);
                        setShowTieBreakerControls(false);
                        setPin('');
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all border-2 ${
                        isPinCorrect 
                          ? 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white group hover:border-indigo-600' 
                          : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span>{team.teamName}</span>
                        <span className={`text-[8px] uppercase tracking-tighter ${isPinCorrect ? 'text-indigo-400 group-hover:text-indigo-200' : 'text-slate-300'}`}>
                          Current Rank: #{team.rank}
                        </span>
                      </div>
                      {isPinCorrect && (
                        <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                          Promote
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => { setShowTieBreakerControls(false); setPin(''); }}
                className="w-full text-slate-400 text-[10px] font-bold uppercase mt-6 hover:text-slate-600 transition"
              >
                Cancel Decision
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {rankings.map((team, idx) => {
          const isChampion = team.teamId === championId;
          const isTiedAtBoundary = team.points === boundaryPoints && hasCriticalTie;
          
          return (
            <div 
              key={team.teamId} 
              className={`flex items-center p-6 rounded-xl border-2 transition-all ${
                isChampion 
                  ? 'bg-yellow-50 border-yellow-400 shadow-lg ring-2 ring-yellow-200' 
                  : isTiedAtBoundary
                    ? 'bg-amber-50 border-amber-300 shadow-sm border-dashed'
                    : team.qualified 
                      ? 'bg-white border-green-100 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mr-6 ${
                isChampion ? 'bg-yellow-500 text-white shadow-yellow-200 shadow-lg' : team.qualified ? 'bg-green-600 text-white' : 'bg-slate-400 text-white'
              }`}>
                {isChampion ? '👑' : team.rank}
              </div>
              <div className="flex-grow">
                <h3 className={`font-bold text-lg ${isChampion ? 'text-yellow-900' : 'text-slate-800'}`}>
                  {team.teamName}
                </h3>
                <p className={`text-sm ${isChampion ? 'text-yellow-700' : 'text-slate-500'}`}>
                  Points: {team.points} | Wins: {team.wins}
                </p>
              </div>
              <div className="text-right">
                {isChampion ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-yellow-500 text-white border border-yellow-600">
                    WINNER
                  </span>
                ) : isTiedAtBoundary ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-white border border-amber-600 animate-pulse">
                    Tie Pending
                  </span>
                ) : team.qualified ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                    Qualified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-200 text-slate-500 border border-slate-300">
                    Eliminated
                  </span>
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
