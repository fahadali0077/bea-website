"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { updateWaitlistForm } from '@/features/waitlist/waitlist.slice';

export default function Hero() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useAppDispatch();

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
        dispatch(updateWaitlistForm({ email: email.trim().toLowerCase() }));
        router.push('/waitlist/3');
    };

    return (
        <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center py-8">

            {/* Left side text container spanning 6 columns */}
            <div className="md:col-span-6 flex flex-col items-start space-y-6">
                <span 
                    className="text-[6px] font-bold uppercase tracking-[0.2em] text-neutral-400 animate-pulse block"
                    style={{ fontFamily: 'SFProDisplay, "SF Pro Display", -apple-system, sans-serif' }}
                >
                    Launching This Summer
                </span>
                <h1 className="text-[36px] font-canela tracking-tight text-neutral-900 leading-[1.1]">
                    Together,<br />today.
                </h1>
                <p className="text-neutral-600 text-[10.5px] font-sans max-w-sm leading-relaxed">
                    24 hour to chat.<br />Only see active profiles.
                </p>

                {/* Interactive Email Pill Input */}
                <div className="w-full max-w-sm">
                    {status === 'success' ? (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-5 py-3.5 text-xs font-medium flex items-center gap-2 animate-fade-in">
                            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>You're on the waitlist! We'll keep you updated.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="w-full max-w-xs flex items-center bg-[#d7d4ce] rounded-full p-1.5 transition-all focus-within:bg-[#d7d4ce]/90 focus-within:ring-2 focus-within:ring-black/5">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="Enter email to join waitlist"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-transparent pl-4 text-[16px] md:text-[7px] font-sans text-neutral-800 placeholder-neutral-600 focus:outline-none py-2 disabled:opacity-50"
                                />
                                <button 
                                    type="submit"
                                    disabled={status === 'submitting' || !email}
                                    className={`bg-[#252018] text-white h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-black transition-all ${
                                        !email ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    {status === 'submitting' ? (
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-[10px] text-red-600 mt-2 ml-4 animate-shake">{error}</p>
                            )}
                        </form>
                    )}
                </div>
            </div>

            {/* Right side Image container spanning 6 columns with landscape aspect ratio */}
            <div className="md:col-span-6 w-full flex justify-center md:justify-end">
                <div className="relative w-full max-w-[500px] aspect-[1.3/1] overflow-hidden rounded-[2.5rem] shadow-sm group">
                    <Image
                        src="/images/hero-scene.jpg"
                        alt="People connecting"
                        fill
                        priority
                        sizes="(max-w-768px) 100vw, 500px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
            </div>

        </section>

    );
}
