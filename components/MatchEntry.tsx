
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
    
    // Safety check for duplicate
    const match = matches.find(m => m.id === selectedMatchId);
    if (match?.winnerId !== null) {
      alert("Error: This match result has already been recorded and is locked.");
      return;
    }

    onSave(Number(selectedMatchId), Number(selectedWinnerId));
  };

  if (pendingMatches.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">All Matches Completed!</h2>
        <p className="text-slate-600 mb-6">There are no more pending matches in the Round Robin stage.</p>
        <button 
          onClick={onCancel}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border">
      <div className="bg-indigo-700 p-6 text-white">
        <h2 className="text-xl font-bold">Record Match Result</h2>
        <p className="text-indigo-100 text-sm">Select the match and the verified winner.</p>
      </div>
      
      <div className="p-8 space-y-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Match</label>
          <select 
            value={selectedMatchId}
            onChange={(e) => {
              setSelectedMatchId(Number(e.target.value));
              setSelectedWinnerId('');
            }}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          >
            <option value="">-- Choose Match --</option>
            {pendingMatches.map(m => {
              const tA = teams.find(t => t.id === m.teamAId)?.name;
              const tB = teams.find(t => t.id === m.teamBId)?.name;
              return (
                <option key={m.id} value={m.id}>Match #{m.id}: {tA} vs {tB}</option>
              );
            })}
          </select>
        </div>

        {selectedMatch && (
          <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Match Setup</h3>
            <div className="flex items-center justify-between text-center gap-4">
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-800">{teamA?.name}</div>
                <div className="text-xs text-slate-500 font-medium">TEAM A</div>
              </div>
              <div className="text-xl font-black text-slate-300 italic">VS</div>
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-800">{teamB?.name}</div>
                <div className="text-xs text-slate-500 font-medium">TEAM B</div>
              </div>
            </div>
          </div>
        )}

        {selectedMatch && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Declare Winner</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedWinnerId(teamA?.id || '')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  selectedWinnerId === teamA?.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                {teamA?.name}
              </button>
              <button
                onClick={() => setSelectedWinnerId(teamB?.id || '')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  selectedWinnerId === teamB?.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                {teamB?.name}
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:transform active:scale-95 transition"
          >
            Save Result
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchEntry;
