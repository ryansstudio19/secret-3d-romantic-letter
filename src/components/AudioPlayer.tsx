import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, X, Check } from 'lucide-react';
import { romanticAudio, PRESET_TRACKS } from '../utils/audioSynth';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [customInputUrl, setCustomInputUrl] = useState(romanticAudio.getCustomUrl());
  const [currentTrack, setCurrentTrack] = useState(romanticAudio.getCurrentTrack());

  useEffect(() => {
    const unsubscribe = romanticAudio.subscribe(() => {
      setIsPlaying(romanticAudio.getIsPlaying());
      setCurrentTrack(romanticAudio.getCurrentTrack());
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    romanticAudio.toggle();
  };

  const handleSelectPreset = (idx: number) => {
    romanticAudio.setTrackIndex(idx);
    setShowPanel(false);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputUrl.trim()) {
      romanticAudio.setCustomUrl(customInputUrl);
      setShowPanel(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end select-none">
      <div className="flex items-center gap-1.5">
        {/* Main Clean Floating Header Button (Restored original aesthetic) */}
        <button
          onClick={handleToggle}
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[44px] min-w-[44px] rounded-full border backdrop-blur-md shadow-xl transition-all duration-300 text-xs sm:text-sm font-serif ${
            isPlaying
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-rose-950/50'
              : 'bg-stone-900/70 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
          title={isPlaying ? 'Mute music' : 'Play music'}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">Music On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-stone-400" />
              <span className="hidden sm:inline">Music</span>
            </>
          )}
        </button>

        {/* Small Music Selection Button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-stone-900/70 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700 backdrop-blur-md transition-colors"
          title="Music options"
        >
          <Music className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Discrete Selector Panel */}
      {showPanel && (
        <div className="mt-2 w-72 p-3.5 rounded-2xl bg-stone-950/95 border border-amber-500/30 backdrop-blur-2xl shadow-2xl text-stone-200 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="font-serif font-medium text-amber-100">Music Tracks</span>
            <button onClick={() => setShowPanel(false)} className="text-stone-400 hover:text-stone-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-400">Select Track:</span>
            {PRESET_TRACKS.map((track, idx) => {
              const isSelected = currentTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectPreset(idx)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-serif flex items-center justify-between ${
                    isSelected ? 'bg-rose-950/80 text-amber-200 border border-rose-500/30' : 'bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span>{track.title} ({track.artist})</span>
                  {isSelected && <Check className="w-3 h-3 text-amber-300 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleApplyCustomUrl} className="space-y-1.5 pt-1 border-t border-stone-800">
            <span className="text-[10px] uppercase font-mono text-stone-400 block">Custom MP3 Audio URL:</span>
            <input
              type="url"
              placeholder="https://example.com/song.mp3"
              value={customInputUrl}
              onChange={(e) => setCustomInputUrl(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="w-full py-1.5 rounded bg-rose-900 hover:bg-rose-800 text-amber-100 font-serif font-medium text-xs transition-colors"
            >
              Set Song URL
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
