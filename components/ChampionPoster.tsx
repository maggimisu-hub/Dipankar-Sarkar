
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#020617',
      });

      const link = document.createElement('a');
      const fileName = `Champion_${champion.name.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Error generating image. You can also take a screenshot.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 animate-in zoom-in fade-in duration-700">
      {/* Captured Section */}
      <div 
        ref={posterRef}
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 shadow-2xl border-2 sm:border-4 border-yellow-500/30 group"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-400 rounded-full blur-[80px] sm:blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[80px] sm:blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-12 md:p-16 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-yellow-500 text-slate-950 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-lg shadow-yellow-500/20">
              Tournament Champions
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-700 uppercase tracking-tighter leading-none mb-2 sm:mb-4 drop-shadow-2xl italic">
            Winners
          </h2>

          {/* Icon */}
          <div className="text-6xl sm:text-8xl md:text-9xl mb-6 sm:mb-8 drop-shadow-[0_0_35px_rgba(234,179,8,0.6)] animate-bounce duration-[1500ms]">
            👑
          </div>

          {/* Name */}
          <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-10">
            <p className="text-indigo-400 font-black text-[9px] sm:text-sm uppercase tracking-[0.4em] sm:tracking-[0.6em] opacity-80">Awarded To</p>
            <h3 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md px-4">
              {champion.name}
            </h3>
          </div>

          {/* Text */}
          <div className="max-w-[280px] sm:max-w-md bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 mb-6 sm:mb-8">
            <p className="text-yellow-100/90 text-xs sm:text-base font-medium leading-relaxed italic">
              "Congratulations on securing the 2024 Title. A truly remarkable performance!"
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 sm:gap-6 mt-2">
            <div className="hidden xs:block h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-yellow-500/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] sm:text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] sm:tracking-[0.4em]">Badminton Masters</span>
              <span className="text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">2024 Season • v1.1</span>
            </div>
            <div className="hidden xs:block h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-yellow-500/50"></div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 sm:gap-3 items-stretch sm:items-center sm:flex-row sm:justify-center mt-2 px-1">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`px-6 py-4 sm:px-10 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl sm:rounded-full text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-2 justify-center ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <span>📥</span> <span>Download for Social Media</span>
            </>
          )}
        </button>

        {onClose && (
          <button 
            onClick={onClose}
            className="px-6 py-4 sm:px-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black rounded-xl sm:rounded-full text-[10px] uppercase tracking-[0.2em] transition-all justify-center"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ChampionPoster;
