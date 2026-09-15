import React from 'react';
import { LetterPage } from '../types';

interface LetterPageCardProps {
  page: LetterPage;
  className?: string;
  isZoomed?: boolean;
}

export const LetterPageCard: React.FC<LetterPageCardProps> = ({ page, className = '', isZoomed = false }) => {
  return (
    <div
      className={`relative w-full max-w-xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-amber-900/20 transition-all duration-300 ${className}`}
      style={{
        aspectRatio: '0.72', // Standard letter page ratio (roughly 8.5x11 / A4)
        backgroundColor: '#f5ebd7',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4), rgba(215, 190, 150, 0.35)),
          linear-gradient(to bottom, rgba(160, 110, 60, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(180, 130, 80, 0.18)'
      }}
    >
      {/* Paper aging margin vignette overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-xl border border-amber-900/15 shadow-[inset_0_0_35px_rgba(120,70,30,0.18)]" />

      {/* Page content area */}
      <div className="relative h-full flex flex-col justify-between p-4 sm:p-8 md:p-10 text-stone-900 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900/20">

        {/* TOP RIGHT DECORATION: Tropical Heliconia (Page 1) */}
        {page.decorations.topRightHeliconia && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-20 sm:w-36 h-20 sm:h-36 opacity-30 pointer-events-none select-none">
            <svg viewBox="0 0 200 200" fill="none" stroke="#6b4423" strokeWidth="1.2" className="w-full h-full">
              <path d="M140 20 Q160 50 130 90 Q110 120 150 170" strokeWidth="2" strokeLinecap="round"/>
              <path d="M135 40 Q170 30 180 50 Q160 60 130 55" fill="none" opacity="0.8"/>
              <path d="M125 70 Q165 60 175 80 Q155 90 120 82" fill="none" opacity="0.8"/>
              <path d="M115 100 Q155 90 165 110 Q145 120 110 112" fill="none" opacity="0.8"/>
              <path d="M105 130 Q145 120 155 140 Q135 150 100 142" fill="none" opacity="0.8"/>
            </svg>
          </div>
        )}

        {/* PARAGRAPHS & BODY CONTENT */}
        <div className="space-y-3 sm:space-y-5 z-10 my-auto">
          {page.paragraphs && page.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={`leading-relaxed text-stone-900 font-serif tracking-normal text-justify ${
                idx === 0 && page.id === 1
                  ? 'font-["Dancing_Script"] text-xl sm:text-3xl text-rose-950 font-bold tracking-wide not-italic text-left mb-2 sm:mb-3'
                  : 'text-stone-900 text-sm sm:text-lg md:text-xl font-medium'
              }`}
              style={{
                fontFamily: idx === 0 && page.id === 1 ? '"Dancing Script", cursive' : '"Cormorant Garamond", Georgia, serif',
                lineHeight: '1.55'
              }}
            >
              {para}
            </p>
          ))}

          {/* PAGE 5 BULLET POINTS */}
          {page.bullets && (
            <div className="space-y-3 sm:space-y-5 text-stone-900 pt-1">
              {page.bullets.map((bullet, idx) => (
                <p
                  key={idx}
                  className={`leading-relaxed font-serif text-xs sm:text-base md:text-lg font-bold tracking-wide text-left ${
                    idx === page.bullets!.length - 1 ? 'text-rose-950 italic text-right pt-1 font-["Caveat"] text-lg sm:text-2xl' : 'text-stone-900'
                  }`}
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    lineHeight: '1.45'
                  }}
                >
                  {bullet}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM DECORATIONS */}
        <div className="relative pt-4 z-10 flex items-center justify-between">
          
          {/* BOTTOM LEFT: Floral Bouquet (Page 1) */}
          {page.decorations.bottomLeftBouquet ? (
            <div className="w-24 sm:w-32 h-24 sm:h-32 opacity-30 pointer-events-none">
              <svg viewBox="0 0 150 150" fill="none" stroke="#5c3818" strokeWidth="1.2">
                <circle cx="50" cy="90" r="22" strokeDasharray="3 2" />
                <circle cx="75" cy="80" r="18" strokeDasharray="3 2" />
                <path d="M30 110 C 40 70, 70 60, 90 100" />
                <path d="M20 130 C 50 100, 80 110, 110 140" />
                <path d="M40 80 Q 20 60 50 40 Q 70 60 40 80 Z" opacity="0.6" />
                <path d="M60 70 Q 40 50 70 30 Q 90 50 60 70 Z" opacity="0.6" />
              </svg>
            </div>
          ) : <div />}

          {/* BOTTOM CENTER: Page Number & Flourish */}
          {page.pageNumber !== null ? (
            <div className="flex flex-col items-center mx-auto">
              <div className="text-amber-950 font-serif text-lg sm:text-xl font-semibold opacity-90">
                {page.pageNumber}
              </div>
              <svg viewBox="0 0 100 20" fill="none" stroke="#78441b" strokeWidth="1" className="w-20 sm:w-28 opacity-40 mt-0.5">
                <path d="M10 10 Q 25 0 50 10 Q 75 20 90 10 M 20 10 C 35 15 65 5 80 10" />
              </svg>
            </div>
          ) : <div />}

          {/* BOTTOM RIGHT: Wax Seal Envelope (Page 1) */}
          {page.decorations.bottomRightEnvelopeWaxSeal && (
            <div className="w-16 sm:w-20 h-12 sm:h-16 relative flex items-center justify-center opacity-85">
              <div className="w-14 sm:w-16 h-10 sm:h-12 border border-amber-900/40 bg-amber-100/50 rounded shadow-sm relative flex items-center justify-center">
                <div className="absolute inset-0 border-t border-amber-900/30 clip-polygon" />
                {/* Wax seal dot */}
                <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-rose-900 border border-amber-400/50 shadow flex items-center justify-center text-[10px] text-amber-200 font-bold">
                  ❤
                </div>
              </div>
            </div>
          )}

          {/* PAGE 5 BOTTOM RIGHT: Rose Vine Flourish */}
          {page.decorations.bottomRoseHeartVine && (
            <div className="w-28 sm:w-36 h-20 opacity-50 ml-auto pointer-events-none">
              <svg viewBox="0 0 120 80" fill="none" stroke="#782333" strokeWidth="1.2">
                <path d="M10 70 Q 50 60 80 30 Q 100 10 110 40 Q 90 60 60 70" />
                <path d="M75 25 C 70 15, 85 10, 80 25 C 75 35, 65 20, 75 25 Z" fill="#881337" opacity="0.6" />
                <path d="M50 55 C 45 45, 60 40, 55 55 Z" fill="#881337" opacity="0.5" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
