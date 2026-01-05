
import React from 'react';
import { Match, Team } from '../types';

interface DashboardProps {
  matches: Match[];
  onEnterResult: () => void;
  onResetClick: () => void;
  onViewPoster: () => void;
  champion?: Team | null;
}

const Dashboard: React.FC<DashboardProps> = ({ matches, onEnterResult, onResetClick, onViewPoster, champion }) => {
  const completed = matches.filter(m => m.winnerId !== null).length;
  const total = matches.length;
  const progress = (completed / total) * 100;
  const roundRobinDone = completed === total;

  return (
    <div className="space-y-4 sm:space-y-8">
      {champion ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border-4 border-yellow-500/20 overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-6 sm:p-12 text-white text-center">
            <div className="text-4xl sm:text-5xl mb-4">👑</div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Tournament Concluded</h2>
            <div className="text-2xl sm:text-3xl font-black tracking-tight mb-4 uppercase">Championship Title</div>
            <div className="text-3xl sm:text-5xl font-black drop-shadow-lg mb-8">{champion.name}</div>
            
            <button 
              onClick={onViewPoster}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              View Victory Poster
            </button>
          </div>
          <div className="p-4 sm:p-6 bg-slate-50 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Victory Declared • Session 2024</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-5 sm:p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tighter">
              {roundRobinDone ? 'Knockouts' : 'Round Robin'}
            </h2>
            <span className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border-2 ${roundRobinDone ? 'bg-green-50 border-green-200 text-green-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
              {roundRobinDone ? 'Ready' : 'Progress'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                  {completed}<span className="text-slate-300 mx-1">/</span>{total}
                </p>
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="relative h-3 sm:h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out shadow-lg ${roundRobinDone ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-700'}`} 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {!roundRobinDone && !champion && (
          <button
            onClick={onEnterResult}
            className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-2xl sm:rounded-3xl border-2 bg-white border-indigo-100 hover:border-indigo-600 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:rotate-12 transition-transform z-10">🏸</span>
            <span className="font-black text-slate-800 uppercase tracking-tight text-base sm:text-lg z-10">Record Match</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase mt-1 sm:mt-2 tracking-widest z-10">Update Results</span>
          </button>
        )}

        <button
          onClick={onResetClick}
          className={`flex flex-col items-center justify-center p-6 sm:p-10 bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-100 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden ${(roundRobinDone && !champion) || champion ? 'md:col-span-2' : ''}`}
        >
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform opacity-0 group-hover:opacity-100"></div>
          <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform z-10">🔄</span>
          <span className="font-black text-slate-800 uppercase tracking-tight text-base sm:text-lg z-10 group-hover:text-red-600">Reset All</span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase mt-1 sm:mt-2 tracking-widest z-10">Fresh Tournament</span>
        </button>
      </div>

      <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-b-4 border-indigo-600">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <h3 className="font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-indigo-400 mb-6 border-b border-white/5 pb-4">Roadmap</h3>
        <div className="grid grid-cols-2 gap-y-6 sm:gap-8">
          {[
            { step: "01", title: "Round Robin", desc: "Qualifiers", active: !roundRobinDone && !champion },
            { step: "02", title: "Rankings", desc: "Top 4", active: roundRobinDone && !champion },
            { step: "03", title: "Semifinals", desc: "Elimination", active: roundRobinDone && !champion },
            { step: "04", title: "Finale", desc: "Champions", active: !!champion }
          ].map((item, i) => (
            <div key={i} className={`space-y-1 transition-opacity ${item.active ? 'opacity-100' : 'opacity-30'}`}>
              <div className="text-[8px] font-black text-indigo-600 bg-indigo-600/10 inline-block px-1.5 py-0.5 rounded tracking-tighter">S-{item.step}</div>
              <div className="text-xs font-black uppercase tracking-tight truncate">{item.title}</div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
