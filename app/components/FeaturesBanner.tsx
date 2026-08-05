import React from 'react';

interface FeaturesBannerProps {
  theme: 'light' | 'dark';
}

const FeaturesBanner: React.FC<FeaturesBannerProps> = ({ theme }) => {
  const isLight = theme === 'light';
  
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-6" aria-label="App Features">
      <div className={`w-full rounded-[1.25rem] p-8 md:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] border flex flex-col lg:flex-row gap-8 lg:gap-4 justify-between items-start lg:items-center transition-colors duration-300 ${
        isLight 
          ? 'bg-[#fffcfe] text-[#050505] border-neutral-100' 
          : 'bg-[#2a2a2a] text-white border-neutral-800'
      }`}>
        
        {/* Left Column: Heading */}
        <div className="lg:w-1/4 flex-shrink-0">
          <h2 className="text-[7px] font-sans font-bold tracking-tight leading-tight uppercase">
            Experience the<br />waitlist
          </h2>
        </div>

        {/* Right Columns: Feature steps */}
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 w-full">
          
          {/* Step 1 */}
          <div className="flex gap-4.5 items-center">
            {/* Calendar Icon wrapper */}
            <div className="relative flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 ${isLight ? 'text-[#050505]' : 'text-white'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {/* Badge overlap */}
              <div className={`absolute -top-1.5 -right-1.5 text-[8px] font-black w-3.5 h-3.5 rounded-[4px] flex items-center justify-center shadow-sm select-none ${isLight ? 'bg-[#050505] text-white' : 'bg-white text-[#2a2a2a]'}`}>
                1
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[9px] font-canela font-bold tracking-tight">
                Join the waitlist
              </h3>
              <p className={`text-[7px] font-sans leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Choose your campus and market
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4.5 items-center">
            {/* Sparkles Icon wrapper */}
            <div className="relative flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 ${isLight ? 'text-[#050505]' : 'text-white'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929l-.707.707M12 1.5v1M4.929 4.929l.707.707M1.5 12h1m2.722 7.071l-.707-.707M12 21.5v-1m7.071-2.722l-.707-.707M21.5 12h-1" />
              </svg>
              {/* Badge overlap */}
              <div className={`absolute -top-1.5 -right-1.5 text-[8px] font-black w-3.5 h-3.5 rounded-[4px] flex items-center justify-center shadow-sm select-none ${isLight ? 'bg-[#050505] text-white' : 'bg-white text-[#2a2a2a]'}`}>
                2
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[9px] font-canela font-bold tracking-tight">
                Friendly competition
              </h3>
              <p className={`text-[7px] font-sans leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Daily icebreaker prompts. Post and vote to gain points.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4.5 items-center">
            {/* Gift Icon wrapper */}
            <div className="relative flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 ${isLight ? 'text-[#050505]' : 'text-white'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125V8.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              {/* Badge overlap */}
              <div className={`absolute -top-1.5 -right-1.5 text-[8px] font-black w-3.5 h-3.5 rounded-[4px] flex items-center justify-center shadow-sm select-none ${isLight ? 'bg-[#050505] text-white' : 'bg-white text-[#2a2a2a]'}`}>
                3
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[9px] font-canela font-bold tracking-tight">
                Win prizes & perks
              </h3>
              <p className={`text-[7px] font-sans leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                We're giving away in-app perks, merch, cash, & a car!
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesBanner;
