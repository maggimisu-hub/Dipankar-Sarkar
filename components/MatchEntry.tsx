
import React, { useState } from 'react';
import { Match, Team } from '../types';

interface MatchEntryProps {
  matches: Match[];
  teams: Team[];
  onSave: (matchId: number, winnerId: number) => void;
  onCancel: () => void;
}

const MatchEntry: React.FC<MatchEntryProps> = ({ matches, teams, onSave, onCancel }) => {
  const pendingMatches = matches.filter(m => m.winnerId === null);
  const [selectedMatchId, setSelectedMatchId] = useState<number | ''>('');
  const [selectedWinnerId, setSelectedWinnerId] = useState<number | ''>('');

  const selectedMatch = matches.find(m => m.id === selectedMatchId);
  const teamA = selectedMatch ? teams.find(t => t.id === selectedMatch.teamAId) : null;
  const teamB = selectedMatch ? teams.find(t => t.id === selectedMatch.teamBId) : null;

  const handleSave = () => {
    if (selectedMatchId === '' || selectedWinnerId === '') {
      alert("Please select both a match and a winner.");
      return;
    }
    onSave(Number(selectedMatchId), Number(selectedWinnerId));
  };

  if (pendingMatches.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border">
        <div className="text-4xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Round Robin Over!</h2>
        <p className="text-slate-500 mb-6 text-sm">No more pending matches to record.</p>
        <button onClick={onCancel} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border">
      <div className="bg-indigo-700 p-6 text-white">
        <h2 className="text-xl font-bold uppercase tracking-tight">Record Result</h2>
        <p className="text-indigo-100 text-sm uppercase font-bold tracking-widest opacity-80">Update Tournament Status</p>
      </div>
      <div className="p-8 space-y-8">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">1. Choose Matchup</label>
          <select value={selectedMatchId} onChange={(e) => { setSelectedMatchId(Number(e.target.value)); setSelectedWinnerId(''); }} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-bold text-slate-700">
            <option value="">-- Select Match --</option>
            {pendingMatches.map(m => (
              <option key={m.id} value={m.id}>Match #{m.id}: {teams.find(t => t.id === m.teamAId)?.name} vs {teams.find(t => t.id === m.teamBId)?.name}</option>
            ))}
          </select>
        </div>
        {selectedMatch && (
          <div className="animate-in fade-in duration-500 space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">2. Declare Winner</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setSelectedWinnerId(teamA!.id)} className={`p-6 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-xs ${selectedWinnerId === teamA!.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-400'}`}>
                {teamA?.name}
              </button>
              <button onClick={() => setSelectedWinnerId(teamB!.id)} className={`p-6 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-xs ${selectedWinnerId === teamB!.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-400'}`}>
                {teamB?.name}
              </button>
            </div>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={!selectedMatch || !selectedWinnerId} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 active:transform active:scale-95 transition text-xs uppercase tracking-widest disabled:opacity-50">Save Result</button>
          <button onClick={onCancel} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-xl hover:bg-slate-200 transition text-xs uppercase tracking-widest">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MatchEntry;
