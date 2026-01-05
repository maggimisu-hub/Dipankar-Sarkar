
import React, { useState, useMemo, useEffect } from 'react';
import { TEAMS, INITIAL_MATCHES } from './constants';
import { Match, TeamStats, RankingEntry, Screen } from './types';
import Dashboard from './components/Dashboard';
import MatchEntry from './components/MatchEntry';
import PointsTable from './components/PointsTable';
import Rankings from './components/Rankings';
import Semifinals from './components/Semifinals';
import ResetModal from './components/ResetModal';
import ChampionPoster from './components/ChampionPoster';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Dashboard);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showGrandPoster, setShowGrandPoster] = useState(false);
  
  const [semi1WinnerId, setSemi1WinnerId] = useState<number | null>(null);
  const [semi2WinnerId, setSemi2WinnerId] = useState<number | null>(null);
  const [finalWinnerId, setFinalWinnerId] = useState<number | null>(null);

  const teamStats = useMemo(() => {
    const stats: Record<number, TeamStats> = {};
    TEAMS.forEach(team => {
      stats[team.id] = { teamId: team.id, teamName: team.name, played: 0, wins: 0, losses: 0, points: 0 };
    });

    matches.forEach(match => {
      if (match.winnerId !== null) {
        const teamA = stats[match.teamAId];
        const teamB = stats[match.teamBId];
        teamA.played += 1;
        teamB.played += 1;
        if (match.winnerId === match.teamAId) {
          teamA.wins += 1;
          teamA.points += 1;
          teamB.losses += 1;
        } else {
          teamB.wins += 1;
          teamB.points += 1;
          teamA.losses += 1;
        }
      }
    });

    return Object.values(stats);
  }, [matches]);

  const rankings = useMemo((): RankingEntry[] => {
    const sorted = [...teamStats].sort((a, b) => b.points - a.points || a.teamId - b.teamId);
    return sorted.map((stat, index) => ({ ...stat, rank: index + 1, qualified: index < 4 }));
  }, [teamStats]);

  const hasCriticalTie = useMemo(() => {
    if (rankings.length < 5) return false;
    return rankings[3].points === rankings[4].points;
  }, [rankings]);

  const allMatchesCompleted = matches.every(m => m.winnerId !== null);
  const champion = useMemo(() => finalWinnerId ? TEAMS.find(t => t.id === finalWinnerId) : null, [finalWinnerId]);

  useEffect(() => {
    if (finalWinnerId) setShowGrandPoster(true);
  }, [finalWinnerId]);

  const handleSaveResult = (matchId: number, winnerId: number) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, winnerId } : m));
    setActiveScreen(Screen.PointsTable);
  };

  const handleReset = () => {
    setMatches(INITIAL_MATCHES);
    setSemi1WinnerId(null);
    setSemi2WinnerId(null);
    setFinalWinnerId(null);
    setShowGrandPoster(false);
    setActiveScreen(Screen.Dashboard);
    setShowResetModal(false);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Dashboard:
        return <Dashboard matches={matches} onEnterResult={() => setActiveScreen(Screen.MatchEntry)} onResetClick={() => setShowResetModal(true)} onViewPoster={() => setShowGrandPoster(true)} champion={champion} />;
      case Screen.MatchEntry:
        return <MatchEntry matches={matches} teams={TEAMS} onSave={handleSaveResult} onCancel={() => setActiveScreen(Screen.Dashboard)} />;
      case Screen.PointsTable:
        return <PointsTable stats={teamStats} championId={finalWinnerId} />;
      case Screen.Rankings:
        return <Rankings rankings={rankings} hasCriticalTie={hasCriticalTie} matches={matches} teams={TEAMS} championId={finalWinnerId} />;
      case Screen.Semifinals:
        return <Semifinals rankings={rankings} allCompleted={allMatchesCompleted} hasCriticalTie={hasCriticalTie} semi1WinnerId={semi1WinnerId} semi2WinnerId={semi2WinnerId} finalWinnerId={finalWinnerId} onSetSemi1Winner={setSemi1WinnerId} onSetSemi2Winner={setSemi2WinnerId} onSetFinalWinner={setFinalWinnerId} teams={TEAMS} />;
      default:
        return <Dashboard matches={matches} onEnterResult={() => setActiveScreen(Screen.MatchEntry)} onResetClick={() => setShowResetModal(true)} onViewPoster={() => setShowGrandPoster(true)} champion={champion} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <header className="bg-slate-900 text-white shadow-xl p-4 sticky top-0 z-40 border-b-2 border-indigo-600/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-inner"><span className="text-xl">🏸</span></div>
            <h1 className="text-lg font-black uppercase tracking-tighter">Tournament Hub <span className="text-indigo-500 font-bold ml-1">v1.1</span></h1>
          </div>
          <div className="flex items-center gap-3">
            {champion && <button onClick={() => setShowGrandPoster(true)} className="bg-yellow-500 text-slate-950 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-lg shadow-yellow-500/20">👑 Poster</button>}
            <button onClick={() => setShowResetModal(true)} className="text-[10px] font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-all">Reset</button>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b sticky top-[62px] z-30 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex min-w-max px-2">
          {[Screen.Dashboard, Screen.MatchEntry, Screen.PointsTable, Screen.Rankings, Screen.Semifinals].map((screen) => (
            <button key={screen} onClick={() => setActiveScreen(screen)} className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeScreen === screen ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {screen === Screen.Semifinals ? 'Knockouts' : screen.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </nav>
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 md:p-8">{renderScreen()}</main>
      {showResetModal && <ResetModal onConfirm={handleReset} onCancel={() => setShowResetModal(false)} />}
      {showGrandPoster && champion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="w-full max-w-3xl relative my-auto">
            <button onClick={() => setShowGrandPoster(false)} className="absolute -top-4 -right-4 z-[70] w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center font-black shadow-2xl hover:scale-110 active:scale-95 transition-all">✕</button>
            <ChampionPoster champion={champion} onClose={() => setShowGrandPoster(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
