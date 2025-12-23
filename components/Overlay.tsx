import React from 'react';

interface OverlayProps {
  isFormed: boolean;
  setIsFormed: (val: boolean) => void;
  isLightsOff: boolean;
  setIsLightsOff: (val: boolean) => void;
  showMagic: boolean;
  setShowMagic: (val: boolean) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ 
  isFormed, setIsFormed, 
  isLightsOff, setIsLightsOff, 
  showMagic, setShowMagic, 
  onPhotoUpload 
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      {/* Title Area */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 text-left">
        <h1 className="font-title text-5xl md:text-7xl text-yellow-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
          Merry Christmas
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-[1px] w-12 bg-yellow-500/50"></div>
          <p className="font-sans text-purple-200/80 text-sm md:text-base tracking-[0.2em] uppercase drop-shadow-md">
            Wishes of Peace & Joy
          </p>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 pointer-events-auto flex gap-4">
        <button 
          onClick={() => setIsLightsOff(!isLightsOff)} 
          className={`glass-btn px-4 py-2 rounded-full text-yellow-500 font-bold text-sm tracking-widest uppercase flex items-center gap-2 border border-yellow-500/30 backdrop-blur-md transition-all hover:bg-yellow-500/20 ${isLightsOff ? 'bg-yellow-500/30' : 'bg-white/5'}`}
        >
          <span>{isLightsOff ? "💡 Lights On" : "🌙 Lights Off"}</span>
        </button>
        <button 
          onClick={() => setShowMagic(!showMagic)} 
          className={`glass-btn px-4 py-2 rounded-full text-yellow-500 font-bold text-sm tracking-widest uppercase flex items-center gap-2 border border-yellow-500/30 backdrop-blur-md transition-all hover:bg-yellow-500/20 ${showMagic ? 'bg-yellow-500/30' : 'bg-white/5'}`}
        >
          <span>🎥 Magic Cam</span>
        </button>
      </div>

      {/* Magic Guide */}
      {showMagic && (
        <div className="absolute top-28 right-8 text-right text-yellow-100/60 text-xs font-sans pointer-events-auto bg-black/40 px-3 py-2 rounded-lg backdrop-blur-sm border border-yellow-500/20">
          <p className="mb-1">✊ Fist: Assemble</p>
          <p className="mb-1">🖐 Open: Explode</p>
          <p className="mb-1">✌ Victory: Dim Lights</p>
          <p>👆 Point: Rotate Camera</p>
        </div>
      )}

      {/* Bottom Left: Upload */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 pointer-events-auto flex flex-col gap-4">
        <label className="cursor-pointer flex items-center gap-3 group text-yellow-100/90 hover:text-yellow-500 transition-all bg-white/5 border border-yellow-500/30 px-5 py-2 rounded-full backdrop-blur-md hover:bg-yellow-500/10">
          <span className="text-xl">📷</span>
          <span className="text-sm font-bold tracking-widest uppercase">Upload Photos</span>
          <input type="file" accept="image/*" multiple onChange={onPhotoUpload} className="hidden" />
        </label>
      </div>

      {/* Bottom Right: Main Toggle */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 pointer-events-auto">
        <button 
          onClick={() => setIsFormed(!isFormed)} 
          className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-2 border-yellow-500/50 backdrop-blur-md transition-all duration-700 hover:scale-110 hover:border-yellow-500 hover:shadow-[0_0_50px_rgba(255,215,0,0.4)] ${isFormed ? 'bg-yellow-500/20' : 'bg-black/40'}`}
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl mb-1">{isFormed ? "✨" : "🎄"}</div>
            <div className="text-[10px] md:text-xs font-bold text-yellow-500 uppercase tracking-widest">
              {isFormed ? "Release" : "Assemble"}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};