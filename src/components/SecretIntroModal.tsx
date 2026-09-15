import React, { useState } from 'react';
import { Heart, Sparkles, Lock } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynth';

interface SecretIntroModalProps {
  onStartSecret: () => void;
}

export const SecretIntroModal: React.FC<SecretIntroModalProps> = ({ onStartSecret }) => {
  const [maybeLaterPos, setMaybeLaterPos] = useState({ x: 0, y: 0 });
  const [teaseMessage, setTeaseMessage] = useState<string | null>(null);

  const handleOpenSecret = () => {
    romanticAudio.start();
    onStartSecret();
  };

  // Playfully dodge when hovered/touched
  const handleMaybeLaterHover = () => {
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 80;
    setMaybeLaterPos({ x: randomX, y: randomY });
  };

  const handleMaybeLaterClick = () => {
    setTeaseMessage("Are you sure? This letter was written specifically for you... ❤️");
    setTimeout(() => {
      setMaybeLaterPos({ x: 0, y: 0 });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/90 backdrop-blur-xl animate-fade-in select-none overflow-y-auto">
      <div className="relative w-full max-w-lg p-5 sm:p-10 max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-stone-900/90 via-stone-900/95 to-rose-950/80 border border-amber-500/20 shadow-2xl text-center space-y-6 sm:space-y-8">
        
        {/* Glowing Top Lock Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-amber-300 shadow-inner">
          <Lock className="w-8 h-8 text-amber-300" />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-[10px] text-white">
            <Heart className="w-3 h-3 fill-current" />
          </div>
        </div>

        {/* Secret Prompt Text */}
        <div className="space-y-3">
          <p className="text-amber-200/90 font-serif italic text-lg sm:text-xl tracking-wide">
            "Someone left something here for you..."
          </p>
          <h2 className="text-2xl sm:text-4xl font-serif font-light text-stone-100 tracking-wide">
            Do you want to open it?
          </h2>
          {teaseMessage && (
            <p className="text-xs sm:text-sm text-rose-300 italic font-serif animate-fade-in pt-1">
              {teaseMessage}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Main Action Button */}
          <button
            onClick={handleOpenSecret}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-stone-100 font-serif text-lg font-medium shadow-xl hover:shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/40 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Open the secret ❤️</span>
          </button>

          {/* Playful Secondary Button */}
          <div className="relative transition-transform duration-300" style={{ transform: `translate(${maybeLaterPos.x}px, ${maybeLaterPos.y}px)` }}>
            <button
              onMouseEnter={handleMaybeLaterHover}
              onTouchStart={handleMaybeLaterHover}
              onClick={handleMaybeLaterClick}
              className="px-6 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 font-serif text-sm tracking-wide transition-colors border border-stone-700/50"
            >
              Maybe later
            </button>
          </div>
        </div>

        {/* Whisper note */}
        <div className="flex flex-col items-center gap-1 text-stone-500 text-xs tracking-wider font-serif pt-4 border-t border-stone-800/50">
          <span className="text-stone-400 font-medium">Made with ❤️ by Ryan Zannah</span>
          <span className="text-[10px] tracking-widest font-mono uppercase text-stone-600">🔒 Private & Confidential Message</span>
        </div>
      </div>
    </div>
  );
};
