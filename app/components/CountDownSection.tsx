import React from 'react';

export default function CountdownSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
      
      {/* Left Column: Visual Countdown clock spanning 5 columns */}
      <div className="md:col-span-5 flex items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center bg-transparent">
          {/* Custom SVG Radial Progress Arc */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-gray-200/40"
              strokeWidth="1.5"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-black"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray="276"
              strokeDashoffset="60"
              strokeLinecap="round"
            />
          </svg>

          {/* Time & Lightning Bolt inside */}
          <div className="flex flex-col items-center justify-center mt-2">
            <span 
              className="text-[30px] font-semibold tracking-tight text-neutral-900"
              style={{ fontFamily: 'BigCaslonFB, "Big Caslon", serif' }}
            >
              23:58:12
            </span>
            <div className="flex justify-between w-[95px] text-[7px] text-neutral-400 font-sans font-bold tracking-wider uppercase mt-1 px-0.5">
              <span>Hrs</span>
              <span>Min</span>
              <span>Sec</span>
            </div>
            
            {/* Lightning bolt at the bottom */}
            <div className="mt-5 text-neutral-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M12 2L3.5 13.5h7L9 22l8.5-11.5h-7L12 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Copy & Benefit Grid spanning 7 columns */}
      <div className="md:col-span-7 flex flex-col space-y-8">
        <div className="space-y-2">
          <span 
            className="text-[6px] font-bold text-neutral-400 uppercase tracking-widest block"
            style={{ fontFamily: 'SFProDisplay, "SF Pro Display", -apple-system, sans-serif' }}
          >
            BUILT FOR THE MOMENT
          </span>
          <h2 className="text-[30px] font-canela tracking-tight text-neutral-900 leading-[1.1]">
            24 hours to connect.
          </h2>
          <p className="text-neutral-600 text-[18px] font-sans">
            Less text, more date.
          </p>
        </div>

        {/* Benefits Row (horizontal on desktop, vertical on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
          {/* Benefit 1 */}
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-900 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-[12px] font-sans font-medium text-neutral-800/90 leading-tight">
              Match<br />with intention
            </span>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-900 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[12px] font-sans font-medium text-neutral-800/90 leading-tight">
              Connect<br />today
            </span>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-900 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L9.75 14.25l2.25-2.25 2.25-2.25z" />
            </svg>
            <span className="text-[12px] font-sans font-medium text-neutral-800/90 leading-tight">
              Explore<br />anywhere
            </span>
          </div>

        </div>
      </div>

    </section>
  );
}