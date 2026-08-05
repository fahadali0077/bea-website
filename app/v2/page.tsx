"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function V2Page() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [error, setError] = useState('');
    const [activeCity, setActiveCity] = useState('NYC');
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
            setEmail('');
            router.push('/thank-you');
        }, 1200);
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col justify-between text-white overflow-hidden select-none">
            {/* Full-Screen Background Image Overlay */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/images/hero-scene.jpg"
                    alt="Background connection scene"
                    fill
                    priority
                    className="object-cover object-[center_35%]"
                />
                {/* Subtle dark gradient overlay to ensure readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-black/10" />
            </div>

            {/* Navbar (Overlaying Top) */}
            <nav className="w-full flex items-center justify-between px-8 py-6 max-w-5xl mx-auto bg-transparent z-10">
                {/* Logo in Canela 30px */}
                <div className="select-none flex items-center">
                    <img src="/images/assets/Bea_png.png" alt="Bea Logo" className="h-[30px] w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
                </div>

                {/* Group Links & CTA on the right */}
                <div className="flex items-center space-x-4 sm:space-x-8">
                    {/* Navigation Links */}
                    <div className="flex items-center space-x-3 sm:space-x-6 text-[10px] sm:text-[11px] font-semibold text-white/90">
                        <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
                        <Link href="/login" className="hover:text-white transition-colors">Ambassadors</Link>
                        <Link href="/calendar" className="hover:text-white transition-colors">Calendar</Link>
                    </div>

                    {/* CTA Button in white pill */}
                    <button className="bg-white text-black text-[10px] font-bold px-3 sm:px-4 py-1.5 rounded-full hover:bg-neutral-100 transition-all shadow-sm whitespace-nowrap">
                        Join waitlist
                    </button>
                </div>
            </nav>

            {/* Main Center-Left Content overlay */}
            <main className="w-full max-w-5xl mx-auto px-8 flex-1 flex flex-col justify-center z-10 py-12">
                <div className="max-w-sm space-y-5">

                    {/* 1. Launching label in Lato 6px */}
                    <span className="text-[6px] font-sans font-extrabold uppercase tracking-[0.25em] text-white/90 block">
                        Launching This Summer
                    </span>

                    {/* 2. Heading in Canela 36px */}
                    <h1 className="text-[36px] font-canela text-white leading-[1.08] tracking-tight">
                        Together,<br />today.
                    </h1>

                    {/* 3. Description in Lato 10.5px */}
                    <p className="text-[10.5px] font-sans text-white/90 leading-relaxed max-w-xs">
                        24 hour rule.<br />Only see active profiles.
                    </p>

                    {/* 4. Interactive Waitlist Form */}
                    <div className="w-full max-w-[260px] pt-1">
                        {status === 'success' ? (
                            <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full px-4 py-2 text-[8px] font-bold flex items-center gap-2 animate-fade-in">
                                <svg className="w-3 h-3 text-white flex-shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Added! Check your inbox soon.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="w-full flex items-center bg-[#d7d4ce] rounded-full p-1 transition-all focus-within:ring-2 focus-within:ring-white/30">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError('');
                                        }}
                                        placeholder="Enter email to join waitlist"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-transparent pl-3 text-[16px] md:text-[7px] font-sans text-neutral-800 placeholder-neutral-600 focus:outline-none py-1 disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting' || !email}
                                        className="bg-[#252018] text-white h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        {status === 'submitting' ? (
                                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-[8px] text-red-300 mt-1.5 ml-3 font-semibold">{error}</p>
                                )}
                            </form>
                        )}
                    </div>

                    {/* 5. Cities pills in Lato 6px and Heading in Lato 7px */}
                    <div className="space-y-2 pt-2">
                        <span className="text-[7px] font-sans font-bold uppercase tracking-wider text-white/80 block">
                            Launching first in
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {['NYC', 'Boston', 'Miami', 'Los Angeles', 'Chicago'].map((city) => {
                                const isActive = activeCity === city;
                                return (
                                    <button
                                        key={city}
                                        onClick={() => setActiveCity(city)}
                                        className={`px-3 py-1 rounded-full text-[6px] font-sans font-extrabold uppercase tracking-widest transition-all ${isActive
                                                ? 'bg-[#050505] text-white border border-[#050505] shadow-sm'
                                                : 'bg-transparent text-white border border-white/40 hover:border-white hover:bg-white/5'
                                            }`}
                                    >
                                        {city}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </main>

            {/* Empty footer to balance layout */}
            <div className="h-10 w-full" />
        </div>
    );
}
