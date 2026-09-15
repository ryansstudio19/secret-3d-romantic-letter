import React, { useState, useRef } from 'react';
import { LetterPageCard } from './LetterPageCard';
import { LETTER_PAGES } from '../data/letterData';
import { playPaperRustleSound } from '../utils/audioSynth';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw, Heart, Sparkles, BookOpen } from 'lucide-react';

interface Letter3DBookViewerProps {
  onCompleteLetter: () => void;
  onReturnToEnvelope?: () => void;
}

export const Letter3DBookViewer: React.FC<Letter3DBookViewerProps> = ({
  onCompleteLetter,
  onReturnToEnvelope
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isZoomed, setIsZoomed] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalPages = LETTER_PAGES.length;
  const currentPage = LETTER_PAGES[currentPageIndex];

  const handleNext = () => {
    if (isFlipping) return;
    if (currentPageIndex < totalPages - 1) {
      playPaperRustleSound();
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev + 1);
        setIsFlipping(false);
      }, 300);
    } else {
      // Reached page 5 -> transition to ending scene
      onCompleteLetter();
    }
  };

  const handlePrev = () => {
    if (isFlipping) return;
    if (currentPageIndex > 0) {
      playPaperRustleSound();
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  // Mobile Touch Swipe Handlers (Differentiates vertical scroll from horizontal page flip)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-stone-950 via-stone-900 to-rose-950/50 flex flex-col items-center justify-between p-2 sm:p-6 md:p-8 select-none overflow-x-hidden">
      
      {/* TOP NAVIGATION BAR */}
      <header className="w-full max-w-4xl flex items-center justify-between z-20 py-1.5 px-3 sm:px-6 bg-stone-900/70 border border-stone-800/80 rounded-full backdrop-blur-md shadow-xl mb-2 sm:mb-6">
        {/* Back / Envelope button */}
        <button
          onClick={onReturnToEnvelope}
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full text-stone-300 hover:text-amber-200 active:bg-rose-950/60 text-xs sm:text-sm font-serif transition-colors"
          title="Return to envelope"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Envelope</span>
        </button>

        {/* Page counter & title */}
        <div className="flex items-center gap-2 text-stone-200 font-serif text-xs sm:text-base">
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span className="text-amber-200/90 font-medium">
            Page {currentPageIndex + 1}
          </span>
          <span className="text-stone-500">/ {totalPages}</span>
        </div>

        {/* Zoom Toggle */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="inline-flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-200 hover:text-amber-200 text-xs sm:text-sm font-serif transition-colors"
          title="Zoom page"
        >
          {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{isZoomed ? 'Fit' : 'Zoom'}</span>
        </button>
      </header>

      {/* MAIN 3D LETTER PAGE DISPLAY CONTAINER */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative my-auto w-full max-w-xl flex items-center justify-center z-10 px-1 sm:px-4 cursor-grab active:cursor-grabbing"
      >
        {/* Left Side Arrow Button (Previous Page) */}
        {currentPageIndex > 0 && (
          <button
            onClick={handlePrev}
            aria-label="Previous Page"
            className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-stone-900/95 hover:bg-rose-900 border border-amber-500/40 text-amber-200 shadow-2xl active:scale-90 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Side Arrow Button (Next Page / Complete) */}
        <button
          onClick={handleNext}
          aria-label={currentPageIndex === totalPages - 1 ? 'Finish Letter' : 'Next Page'}
          className="absolute right-1 sm:-right-12 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-stone-900/95 hover:bg-rose-900 border border-amber-500/40 text-amber-200 shadow-2xl active:scale-90 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 3D Paper Flip Container */}
        <div
          className={`w-full transition-all duration-300 transform ${
            isFlipping
              ? flipDirection === 'next'
                ? '-rotate-y-12 scale-95 opacity-50 blur-[0.5px]'
                : 'rotate-y-12 scale-95 opacity-50 blur-[0.5px]'
              : 'rotate-y-0 scale-100 opacity-100'
          } ${isZoomed ? 'scale-105 sm:scale-110' : ''}`}
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          <LetterPageCard page={currentPage} isZoomed={isZoomed} />
        </div>
      </main>

      {/* FOOTER CONTROLS & PAGE INDICATOR DOTS */}
      <footer className="w-full max-w-xl flex flex-col items-center gap-2 z-20 pt-2 pb-2">
        {/* Page Dots */}
        <div className="flex items-center justify-center gap-1.5">
          {LETTER_PAGES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                if (idx !== currentPageIndex && !isFlipping) {
                  playPaperRustleSound();
                  setFlipDirection(idx > currentPageIndex ? 'next' : 'prev');
                  setIsFlipping(true);
                  setTimeout(() => {
                    setCurrentPageIndex(idx);
                    setIsFlipping(false);
                  }, 300);
                }
              }}
              className="p-2 min-h-[44px] min-w-[36px] flex items-center justify-center cursor-pointer"
              title={`Go to page ${idx + 1}`}
            >
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentPageIndex
                    ? 'w-8 bg-amber-400 shadow-lg shadow-amber-400/50'
                    : 'w-2.5 bg-stone-700 hover:bg-stone-500'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Swipe prompt hint on mobile & Creator credit */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-stone-400 text-xs font-serif tracking-wider">
          <span>Swipe or click arrows to flip pages</span>
          <span className="hidden sm:inline text-stone-600">•</span>
          <span className="text-stone-500 font-medium">Made with ❤️ by Ryan Zannah</span>
          {currentPageIndex === totalPages - 1 && (
            <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse ml-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tap next for final note</span>
            </span>
          )}
        </div>
      </footer>
    </div>
  );
};
