import React, { useState } from 'react';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EndingSceneProps {
  onRestart: () => void;
}

export const EndingScene: React.FC<EndingSceneProps> = ({ onRestart }) => {
  const [secretDiscovered, setSecretDiscovered] = useState(false);

  const handleSecretClick = () => {
    setSecretDiscovered(true);
    // Soft romantic confetti burst
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbcfe8', '#f59e0b', '#881337']
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-stone-950 via-stone-900 to-rose-950/70 flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden animate-fade-in">
      {/* Background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-rose-900/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto space-y-6 sm:space-y-10 p-5 sm:p-12 rounded-3xl bg-stone-900/40 border border-stone-800/80 backdrop-blur-xl shadow-2xl">
        
        {/* Floating Heart Icon */}
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-rose-900/80 to-rose-950/90 border border-rose-500/40 flex items-center justify-center shadow-xl animate-bounce">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400 fill-rose-500/30" />
        </div>

        {/* Main Emotional Ending Quote */}
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xl sm:text-4xl font-serif font-light text-amber-100/95 tracking-wide leading-relaxed drop-shadow">
            "Some words are easier to write than to say."
          </p>

          <div className="text-3xl sm:text-5xl text-rose-500 animate-pulse pt-1">
            ❤️
          </div>
        </div>

        {/* Action Button: Read it again */}
        <div className="pt-2 sm:pt-4">
          <button
            onClick={onRestart}
            className="group inline-flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 min-h-[48px] rounded-full bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-rose-100 font-serif text-base sm:text-lg font-medium shadow-2xl hover:shadow-rose-800/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-400/40"
          >
            <RotateCcw className="w-5 h-5 text-amber-300 group-hover:-rotate-90 transition-transform duration-500" />
            <span>Read it again</span>
          </button>
        </div>

        {/* Secret Hidden Interaction (Tiny Subtle Heart) */}
        <div className="pt-4 sm:pt-8 border-t border-stone-800/60 flex flex-col items-center gap-2">
          {!secretDiscovered ? (
            <button
              onClick={handleSecretClick}
              className="group p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-rose-950/30 transition-all duration-300 opacity-50 hover:opacity-100 cursor-pointer"
              title="A tiny secret..."
            >
              <Heart className="w-4 h-4 text-rose-400/80 group-hover:scale-125 transition-transform" />
            </button>
          ) : (
            <div className="animate-fade-in p-3 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-amber-200 text-xs sm:text-sm font-serif italic tracking-wide max-w-xs flex items-center justify-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>"If you found this, you were paying attention. ❤️"</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer watermark */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1 text-stone-500 text-xs font-serif tracking-wider opacity-70">
        <span>Made with ❤️ by Ryan Zannah</span>
        <span className="text-[10px] tracking-widest font-mono uppercase opacity-50">Forever & Always</span>
      </div>
    </div>
  );
};
