
import React, { useState } from 'react';
import { RankingEntry, Team } from '../types';

interface SemifinalsProps {
  rankings: RankingEntry[];
  allCompleted: boolean;
  hasCriticalTie: boolean;
  semi1WinnerId: number | null;
  semi2WinnerId: number | null;
  finalWinnerId: number | null;
  onSetSemi1Winner: (id: number) => void;
  onSetSemi2Winner: (id: number) => void;
  onSetFinalWinner: (id: number) => void;
  teams: Team[];
}

const ADMIN_PIN = "2024";

const Semifinals: React.FC<SemifinalsProps> = ({ 
  rankings, 
  allCompleted, 
  hasCriticalTie,
  semi1WinnerId,
  semi2WinnerId,
  finalWinnerId,
  onSetSemi1Winner,
  onSetSemi2Winner,
  onSetFinalWinner,
  teams
}) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!allCompleted) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="text-5xl mb-4 animate-pulse">⏳</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Round Robin in Progress</h2>
        <p className="text-slate-500">The knockout bracket will be revealed once all 10 preliminary matches are completed.</p>
      </div>
    );
  }

  if (hasCriticalTie) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-amber-200">
        <div className="text-5xl mb-4">⚖️</div>
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Tie Resolution Required</h2>
        <p className="text-amber-600 mb-6">
          An unresolved tie at the qualification boundary prevents bracket generation.
        </p>
        <div className="inline-block p-4 bg-amber-50 rounded-lg text-sm text-amber-900 italic font-medium">
          Conflict: {rankings[3]?.teamName} vs {rankings[4]?.teamName}
        </div>
        <p className="mt-4 text-xs text-amber-500 uppercase font-black tracking-widest">Resolve in Rankings Tab</p>
      </div>
    );
  }

  const semi1 = { rank1: rankings[0], rank4: rankings[3] };
  const semi2 = { rank2: rankings[1], rank3: rankings[2] };

  const finalTeam1 = teams.find(t => t.id === semi1WinnerId);
  const finalTeam2 = teams.find(t => t.id === semi2WinnerId);
  const champion = teams.find(t => t.id === finalWinnerId);

  const handleSetWinner = (stage: 'semi1' | 'semi2' | 'final', teamId: number) => {
    if (!isUnlocked) return;
    if (stage === 'semi1') onSetSemi1Winner(teamId);
    if (stage === 'semi2') onSetSemi2Winner(teamId);
    if (stage === 'final') onSetFinalWinner(teamId);
  };

  const TeamCard = ({ team, isWinner, onSelect, label, isFinalist }: { 
    team: Team | RankingEntry, 
    isWinner: boolean, 
    onSelect: () => void, 
    label: string, 
    isFinalist?: boolean 
  }) => (
    <button
      onClick={onSelect}
      disabled={!isUnlocked}
      className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${
        isWinner 
          ? 'bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200 z-10 scale-[1.02]' 
          : isUnlocked 
            ? 'bg-white border-slate-200 hover:border-indigo-400 cursor-pointer' 
            : 'bg-slate-50 border-slate-100 opacity-90 cursor-not-allowed'
      }`}
    >
      {isWinner && (
        <span className="absolute -top-3 -right-3 text-2xl drop-shadow-sm">🏆</span>
      )}
      <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">{label}</div>
      <div className={`font-bold leading-tight truncate ${isWinner ? 'text-indigo-900' : 'text-slate-700'}`}>
        {'teamName' in team ? team.teamName : team.name}
      </div>
      {isUnlocked && !isWinner && (
        <div className="mt-2 text-[8px] font-black text-indigo-600 uppercase tracking-tighter">Declare Winner</div>
      )}
    </button>
  );

  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Knockout Admin Controls */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">⚔️</div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-sm">Knockout Stage Controls</h3>
            <p className="text-slate-400 text-[10px] uppercase font-bold">Admin Authorization Required</p>
          </div>
        </div>
        {!isUnlocked ? (
          <div className="flex items-center gap-2">
            <input 
              type="password" 
              placeholder="PIN" 
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const val = e.target.value;
                setPin(val);
                if (val === ADMIN_PIN) {
                  setIsUnlocked(true);
                  setPin('');
                }
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-24 text-center tracking-widest"
            />
            <span className="text-[10px] text-slate-500 font-bold">UNLOCK TO EDIT</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">✓ ADMIN ACTIVE</span>
            <button 
              onClick={() => setIsUnlocked(false)} 
              className="text-[10px] uppercase font-black text-slate-400 hover:text-white transition"
            >
              Lock
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
        {/* Connection Line (Desktop Only) */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-slate-200 z-0"></div>

        {/* COLUMN 1: SEMIFINALS */}
        <div className="space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Semifinals</h2>
            <p className="text-slate-400 text-xs">Top 4 from Round Robin</p>
          </div>

          <div className="space-y-16">
            {/* SF 1 */}
            <div className="space-y-2 group">
              <TeamCard 
                team={semi1.rank1} 
                isWinner={semi1WinnerId === semi1.rank1.teamId} 
                onSelect={() => handleSetWinner('semi1', semi1.rank1.teamId)} 
                label="Rank 1"
              />
              <div className="flex items-center justify-center h-4 relative">
                <div className="w-px h-full bg-slate-200"></div>
                <span className="bg-white px-2 text-[10px] font-black text-slate-300 italic z-10">VS</span>
              </div>
              <TeamCard 
                team={semi1.rank4} 
                isWinner={semi1WinnerId === semi1.rank4.teamId} 
                onSelect={() => handleSetWinner('semi1', semi1.rank4.teamId)} 
                label="Rank 4"
              />
            </div>

            {/* SF 2 */}
            <div className="space-y-2 group">
              <TeamCard 
                team={semi2.rank2} 
                isWinner={semi2WinnerId === semi2.rank2.teamId} 
                onSelect={() => handleSetWinner('semi2', semi2.rank2.teamId)} 
                label="Rank 2"
              />
              <div className="flex items-center justify-center h-4 relative">
                <div className="w-px h-full bg-slate-200"></div>
                <span className="bg-white px-2 text-[10px] font-black text-slate-300 italic z-10">VS</span>
              </div>
              <TeamCard 
                team={semi2.rank3} 
                isWinner={semi2WinnerId === semi2.rank3.teamId} 
                onSelect={() => handleSetWinner('semi2', semi2.rank3.teamId)} 
                label="Rank 3"
              />
            </div>
          </div>
        </div>

        {/* COLUMN 2: GRAND FINALE */}
        <div className="space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tighter">The Grand Finale</h2>
            <p className="text-slate-400 text-xs">Championship Match</p>
          </div>

          {semi1WinnerId && semi2WinnerId ? (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              <div className="bg-white rounded-2xl p-6 border-2 border-indigo-600 shadow-2xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                
                <div className="relative space-y-4">
                  <TeamCard 
                    team={finalTeam1!} 
                    isWinner={finalWinnerId === finalTeam1?.id} 
                    onSelect={() => handleSetWinner('final', finalTeam1!.id)} 
                    label="Finalist 1"
                  />
                  <div className="text-center py-2">
                    <div className="text-2xl font-black text-indigo-100">VS</div>
                    <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mt-1">Tournament Final</div>
                  </div>
                  <TeamCard 
                    team={finalTeam2!} 
                    isWinner={finalWinnerId === finalTeam2?.id} 
                    onSelect={() => handleSetWinner('final', finalTeam2!.id)} 
                    label="Finalist 2"
                  />
                </div>
              </div>

              {champion && (
                <div className="text-center space-y-4 p-8 bg-yellow-400 rounded-3xl shadow-xl animate-in zoom-in duration-500 border-4 border-white">
                  <div className="text-6xl animate-bounce drop-shadow-md">👑</div>
                  <div>
                    <h3 className="text-[10px] font-black text-yellow-900 uppercase tracking-widest mb-1">Official Champion</h3>
                    <div className="text-3xl font-black text-slate-900 leading-tight">{champion.name}</div>
                  </div>
                  <div className="inline-block px-8 py-3 bg-slate-900 text-white font-black rounded-full text-sm uppercase tracking-widest shadow-lg">
                    Grand Victory
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-300 bg-slate-50/50">
              <div className="text-5xl mb-4 opacity-30">🏸</div>
              <p className="text-xs font-black uppercase tracking-widest">Waiting for Finalists</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2 px-8 text-center uppercase tracking-tight">Complete Semifinals to unlock the Grand Finale</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Semifinals;
