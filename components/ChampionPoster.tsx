
import React, { useRef, useState } from 'react';
import { Team } from '../types';
import * as htmlToImage from 'html-to-image';

interface ChampionPosterProps {
  champion: Team;
  onClose?: () => void;
}

const ChampionPoster: React.FC<ChampionPosterProps> = ({ champion, onClose }) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure any pending animations settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Higher quality for sharing on WhatsApp/Social Media
        backgroundColor: '#020617', // Match slate-950
      });

      const link = document.createElement('a');
      const fileName = `Tournament_Champion_${champion.name.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Failed to generate image. Please try again or take a screenshot.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in zoom-in fade-in duration-700">
      {/* Captured Section */}
      <div 
        ref={posterRef}
        className="relative w-full overflow-hidden rounded-3xl bg-slate-950 shadow-2xl border-4 border-yellow-500/30 group"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-400 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[100px] animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-white/5 rounded-full scale-150"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-white/5 rounded-full scale-110"></div>
        </div>

        <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center">
          {/* Top Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-yellow-500/20">
              <span className="text-sm">★</span>
              Tournament Winners
              <span className="text-sm">★</span>
            </div>
          </div>

          {/* The Title */}
          <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-700 uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl italic">
            Champions
          </h2>

          {/* The Crown */}
          <div className="text-8xl md:text-9xl mb-8 drop-shadow-[0_0_35px_rgba(234,179,8,0.6)] animate-bounce duration-[1500ms]">
            👑
          </div>

          {/* Winner Name */}
          <div className="space-y-4 mb-10">
            <p className="text-indigo-400 font-black text-sm uppercase tracking-[0.6em] opacity-80">Presented To</p>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
              {champion.name}
            </h3>
          </div>

          {/* Congratulatory Message */}
          <div className="max-w-md bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8 shadow-xl">
            <p className="text-yellow-100/90 text-sm md:text-base font-medium leading-relaxed italic">
              "An outstanding display of skill, coordination, and sportsmanship. Congratulations on conquering the court and securing the 2024 Badminton Masters Title!"
            </p>
          </div>

          {/* Tournament Info Seal */}
          <div className="flex items-center gap-6 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-500/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">Badminton Masters</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Official Tournament Board • v1.1</span>
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-500/50"></div>
          </div>
        </div>

        {/* Stylized Court Lines Overly */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white"></div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-white"></div>
          <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-white"></div>
        </div>
      </div>

      {/* Action Buttons (Excluded from capture) */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-2">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`px-10 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-full text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[200px] justify-center ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span>📥</span> Download Poster
            </>
          )}
        </button>

        {onClose && (
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black rounded-full text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl hover:scale-105 active:scale-95 min-w-[200px]"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ChampionPoster;