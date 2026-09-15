import React, { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynth';

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    const newState = romanticAudio.toggle();
    setIsPlaying(newState);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-serif backdrop-blur-md shadow-xl transition-all duration-300 ${
          isPlaying
            ? 'bg-rose-950/80 border-rose-500/50 text-amber-200'
            : 'bg-stone-900/70 border-stone-700/60 text-stone-400 hover:text-stone-200'
        }`}
        title={isPlaying ? 'Mute Music' : 'Play Romantic Music'}
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-300 animate-pulse' : 'text-stone-500'}`} />
        <span>{isPlaying ? 'Music On' : 'Music Off'}</span>
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-amber-300" />
        ) : (
          <VolumeX className="w-4 h-4 text-stone-500" />
        )}
      </button>
    </div>
  );
};
