
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
  const [tieBreakWinnerId, setTieBreakWinnerId] = useState<number | null>(null);
  const [showGrandPoster, setShowGrandPoster] = useState(false);
  
  // Knockout State
  const [semi1WinnerId, setSemi1WinnerId] = useState<number | null>(null);
  const [semi2WinnerId, setSemi2WinnerId] = useState<number | null>(null);
  const [finalWinnerId, setFinalWinnerId] = useState<number | null>(null);

  // Derive Stats
  const teamStats = useMemo(() => {
    const stats: Record<number, TeamStats> = {};
    TEAMS.forEach(team => {
      stats[team.id] = {
        teamId: team.id,
        teamName: team.name,
        played: 0,
        wins: 0,
        losses: 0,
        points: 0
      };
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

  // Derive Rankings with tie-break awareness
  const rankings = useMemo((): RankingEntry[] => {
    const sorted = [...teamStats].sort((a, b) => {
      // Primary Sort: Points
      if (b.points !== a.points) return b.points - a.points;
      
      // Secondary Sort: Manual Tie-Break Winner (Admin Decision)
      if (tieBreakWinnerId !== null) {
        if (a.teamId === tieBreakWinnerId) return -1;
        if (b.teamId === tieBreakWinnerId) return 1;
      }
      
      // Tertiary Sort: Original ID (to keep it deterministic until admin intervenes)
      return a.teamId - b.teamId;
    });

    return sorted.map((stat, index) => ({
      ...stat,
      rank: index + 1,
      qualified: index < 4
    }));
  }, [teamStats, tieBreakWinnerId]);

  // Final Champion
  const champion = useMemo(() => {
    if (finalWinnerId === null) return null;
    return TEAMS.find(t => t.id === finalWinnerId) || null;
  }, [finalWinnerId]);

  // Show poster when champion is first determined
  useEffect(() => {
    if (finalWinnerId !== null) {
      setShowGrandPoster(true);
    } else {
      setShowGrandPoster(false);
    }
  }, [finalWinnerId]);

  // Tie handling at Rank 4/5 boundary
  const hasCriticalTie = useMemo(() => {
    if (rankings.length < 5) return false;
    
    const r4 = rankings[3];
    const r5 = rankings[4];

    // Case 1: No tie at the qualification boundary
    if (r4.points !== r5.points) return false;

    // Case 2: Points are equal. Check if the admin has already resolved this specific boundary conflict.
    // If the team at Rank 4 (or higher) is the tie-break winner, the tie is resolved.
    if (tieBreakWinnerId !== null) {
      const winnerRank = rankings.findIndex(r => r.teamId === tieBreakWinnerId) + 1;
      // If the selected winner is in the top 4, they have claimed their spot.
      if (winnerRank <= 4) return false;
    }
    
    return true;
  }, [rankings, tieBreakWinnerId]);

  const allMatchesCompleted = matches.every(m => m.winnerId !== null);

  // Handlers
  const handleSaveResult = (matchId: number, winnerId: number) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, winnerId } : m));
    setActiveScreen(Screen.PointsTable);
  };

  const handleReset = () => {
    setMatches(INITIAL_MATCHES);
    setTieBreakWinnerId(null);
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
        return (
          <Dashboard 
            matches={matches} 
            onEnterResult={() => setActiveScreen(Screen.MatchEntry)} 
            onResetClick={() => setShowResetModal(true)} 
            onViewPoster={() => setShowGrandPoster(true)}
            champion={champion}
          />
        );
      case Screen.MatchEntry:
        return (
          <MatchEntry 
            matches={matches} 
            teams={TEAMS} 
            onSave={handleSaveResult} 
            onCancel={() => setActiveScreen(Screen.Dashboard)}
          />
        );
      case Screen.PointsTable:
        return <PointsTable stats={teamStats} championId={finalWinnerId} />;
      case Screen.Rankings:
        return (
          <Rankings 
            rankings={rankings} 
            hasCriticalTie={hasCriticalTie} 
            matches={matches} 
            teams={TEAMS}
            onResolveTie={setTieBreakWinnerId}
            championId={finalWinnerId}
          />
        );
      case Screen.Semifinals:
        return (
          <Semifinals 
            rankings={rankings} 
            allCompleted={allMatchesCompleted} 
            hasCriticalTie={hasCriticalTie}
            semi1WinnerId={semi1WinnerId}
            semi2WinnerId={semi2WinnerId}
            finalWinnerId={finalWinnerId}
            onSetSemi1Winner={setSemi1WinnerId}
            onSetSemi2Winner={setSemi2WinnerId}
            onSetFinalWinner={setFinalWinnerId}
            teams={TEAMS}
          />
        );
      default:
        return <Dashboard matches={matches} onEnterResult={() => setActiveScreen(Screen.MatchEntry)} onResetClick={() => setShowResetModal(true)} onViewPoster={() => setShowGrandPoster(true)} champion={champion} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-slate-900 text-white shadow-xl p-4 sticky top-0 z-40 border-b-2 border-indigo-600/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-inner">
              <span className="text-xl">🏸</span>
            </div>
            <h1 className="text-lg font-black uppercase tracking-tighter">Tournament Hub <span className="text-indigo-500 font-bold ml-1">v1.1</span></h1>
          </div>
          <div className="flex items-center gap-3">
            {champion && (
              <button 
                onClick={() => setShowGrandPoster(true)}
                className="hidden sm:flex items-center gap-2 bg-yellow-500 text-slate-950 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
              >
                <span>👑</span> View Poster
              </button>
            )}
            <button 
              onClick={() => setShowResetModal(true)} 
              className="text-[10px] font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-[62px] z-30 shadow-sm overflow-x-auto whitespace-nowrap no-scrollbar">
        <div className="max-w-4xl mx-auto flex">
          {[Screen.Dashboard, Screen.MatchEntry, Screen.PointsTable, Screen.Rankings, Screen.Semifinals].map((screen) => (
            <button
              key={screen}
              onClick={() => setActiveScreen(screen)}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${
                activeScreen === screen 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {screen === Screen.Semifinals ? 'Knockout Stage' : screen.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto w-full p-4 pb-24 md:p-8">
        {renderScreen()}
      </main>

      <footer className="bg-white border-t p-8 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Tournament Management System</div>
          <div className="h-px w-12 bg-slate-200"></div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            Designed for deterministic rule-based scoring. Data is cleared on browser refresh.
          </p>
        </div>
      </footer>

      {showResetModal && (
        <ResetModal onConfirm={handleReset} onCancel={() => setShowResetModal(false)} />
      )}

      {/* Full Screen Grand Poster Modal */}
      {showGrandPoster && champion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-3xl relative">
            <button 
              onClick={() => setShowGrandPoster(false)}
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white text-slate-900 rounded-full flex items-center justify-center font-black shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
              ✕
            </button>
            <ChampionPoster champion={champion} onClose={() => setShowGrandPoster(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
