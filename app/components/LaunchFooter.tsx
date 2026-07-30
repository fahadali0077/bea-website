"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LaunchFooter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [error, setError] = useState('');
    const router = useRouter();

    const validateEmail = (emailStr: string) => {
        return /\S+@\S+\.\S+/.test(emailStr);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }

        setError('');
        setStatus('submitting');
        
        setTimeout(() => {
            setStatus('success');
            router.push('/thank-you');
        }, 1200);
    };

    return (
        <footer id="footer-waitlist" className="w-full max-w-5xl mx-auto px-6 pb-12 mt-12">
            <div className="w-full bg-[#f7f4f0] rounded-[2.5rem] p-8 md:p-12 border border-[#d3ceca] flex flex-col md:flex-row justify-between items-center gap-10">
                
                {/* Left Column: Heading Copy & Micro Points */}
                <div className="space-y-8 md:w-1/2 w-full">
                    <div className="space-y-2">
                        <h2 className="text-[26px] md:text-[36px] font-canela font-normal tracking-tight text-[#000000] leading-tight">
                            Be first when Bea launches.
                        </h2>
                        <p className="text-[14px] md:text-[18px] font-lato font-medium text-[#4c4b4a]/90">
                            Meet intentionally. Connect faster.
                        </p>
                    </div>

                    {/* Three horizontal small labels */}
                    <div className="grid grid-cols-3 gap-4 border-t border-[#4c4b4a]/20 pt-6">
                        <div className="space-y-1">
                            <span className="text-[11px] md:text-[14px] font-lato font-medium text-[#4c4b4a]/90 block leading-tight">
                                Early<br />access
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] md:text-[14px] font-lato font-medium text-[#4c4b4a]/90 block leading-tight">
                                Interactive<br />waitlist experience
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] md:text-[14px] font-lato font-medium text-[#4c4b4a]/90 block leading-tight">
                                Shape the<br />community
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stacked Email Input & Join Waitlist Button */}
                <div className="md:w-1/3 w-full flex flex-col justify-center">
                    {status === 'success' ? (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl p-5 text-xs font-medium flex items-center gap-2 animate-fade-in w-full max-w-sm">
                            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Successfully registered! Welcome aboard. 🎉</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
                            {/* 1. Input Box */}
                             <div className="w-full">
                                 <input
                                     type="email"
                                     value={email}
                                     onChange={(e) => {
                                         setEmail(e.target.value);
                                         if (error) setError('');
                                     }}
                                     placeholder="Your email address"
                                     disabled={status === 'submitting'}
                                     className="w-full bg-[#f8f6f3] border border-[#f8f6f3] rounded-2xl px-5 py-3.5 text-[12px] md:text-[14px] font-lato text-neutral-800/80 placeholder-[#4c4b4a]/70 focus:outline-none focus:bg-[#f8f6f3]/90 transition-all shadow-sm"
                                 />
                             </div>
                             
                             {/* 2. Button */}
                             <button
                                 type="submit"
                                 disabled={status === 'submitting' || !email}
                                 className={`w-full bg-[#000000] text-white py-4 px-6 rounded-2xl text-[14px] md:text-[18px] font-lato font-medium normal-case tracking-normal hover:bg-neutral-800 transition-all flex items-center justify-between ${
                                     !email ? 'cursor-not-allowed' : 'hover:scale-[1.01] active:scale-95'
                                 }`}
                             >
                                 <span>Join waitlist</span>
                                {status === 'submitting' ? (
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                )}
                            </button>
                            {error && (
                                <p className="text-[10px] text-red-600 mt-0.5 ml-4 animate-shake">{error}</p>
                            )}
                        </form>
                    )}
                </div>

            </div>
        </footer>
    );
}