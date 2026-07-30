"use client";

import React from 'react';
import Link from 'next/link';
import { Playfair_Display, Oxygen } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
});

const oxygen = Oxygen({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
    variable: '--font-oxygen',
});

export default function ThankYouPage() {
    return (
        <div className={`min-h-screen flex flex-col w-full ${playfair.variable} ${oxygen.variable} font-sans select-none`}>
            
            {/* TOP SECTION: Beige (#e1dad3) */}
            <div className="bg-[#e1dad3] w-full flex flex-col justify-between flex-1 min-h-[60vh] pb-16">
                
                {/* Navbar */}
                <nav className="w-full flex items-center justify-between px-8 py-5 max-w-5xl mx-auto bg-transparent">
                    {/* join waitlist text in Lato */}
                    <Link href="/" className="text-xs font-bold text-neutral-800 tracking-wider hover:opacity-80 transition-opacity uppercase">
                        join waitlist
                    </Link>

                    {/* Right Menu */}
                    <div className="flex items-center space-x-6 text-xs font-semibold text-neutral-800">
                        <Link href="#" className="hover:text-black transition-colors">contact</Link>
                        <Link href="/v2" className="hover:text-black transition-colors">about</Link>
                        <Link href="/login" className="border border-amber-600/40 text-amber-700 px-3.5 py-1 rounded-md hover:bg-amber-600/5 transition-all font-bold">
                            apply
                        </Link>
                    </div>
                </nav>

                {/* Main Heading & Content */}
                <div className="flex-1 flex flex-col justify-center items-center px-6 text-center space-y-8 max-w-xl mx-auto py-12">
                    {/* Heading: Playfair Display, 36px */}
                    <h1 className="text-[36px] font-serif font-bold text-neutral-900 tracking-tight leading-tight">
                        Thank you for applying!
                    </h1>

                    {/* Subtext: Oxygen, 12px */}
                    <p className="text-[12px] font-sans text-neutral-800 leading-relaxed font-light" style={{ fontFamily: 'var(--font-oxygen), sans-serif' }}>
                        Application review takes up to 4 weeks to process. We try our best to go
                        through them as soon as they come in. Look forward to meeting you :)
                    </p>

                    {/* Home Pill Button */}
                    <div className="pt-2">
                        <Link href="/" className="border border-amber-600/50 text-amber-700 font-bold text-xs px-8 py-2.5 rounded-full hover:bg-amber-600/5 transition-all">
                            Home
                        </Link>
                    </div>
                </div>

            </div>

            {/* BOTTOM SECTION: Dark Gray (#333333) */}
            <div className="bg-[#333333] w-full text-white py-16 px-8 flex flex-col justify-between min-h-[40vh]">
                
                {/* Heading: Playfair Display, 24px */}
                <div className="max-w-5xl mx-auto w-full text-center py-6">
                    <h2 className="text-[24px] font-serif font-medium tracking-tight text-white leading-tight">
                        An hour to a plan, a lifetime to remember.
                    </h2>
                </div>

                {/* Footer Grid Info */}
                <div className="max-w-5xl mx-auto w-full mt-auto pt-10">
                    {/* Divider line */}
                    <div className="border-t border-white/10 w-full mb-8" />

                    {/* Links Grid and Copyright - all text at 6px in white */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-[6px] tracking-widest uppercase text-white/70">
                        
                        <div className="flex gap-12">
                            {/* Column 1: Legal */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-white block">Legal</span>
                                <Link href="#" className="block hover:text-white transition-colors">Terms</Link>
                                <Link href="#" className="block hover:text-white transition-colors">Cookie Policy</Link>
                                <Link href="#" className="block hover:text-white transition-colors">Privacy Policy</Link>
                            </div>

                            {/* Column 2: Resources */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-white block">Resources</span>
                                <Link href="#" className="block hover:text-white transition-colors">FAQ</Link>
                                <Link href="#" className="block hover:text-white transition-colors">Safety Tips</Link>
                            </div>

                            {/* Column 3: Index */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-white block">Index</span>
                                <Link href="#" className="block hover:text-white transition-colors">Contact</Link>
                                <Link href="/v2" className="block hover:text-white transition-colors">Learn</Link>
                                <Link href="/login" className="block hover:text-white transition-colors">Ambassadors</Link>
                                <Link href="/" className="block hover:text-white transition-colors">Join Waitlist</Link>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="md:text-right">
                            <span>2024 Sponte LLC. All Rights Reserved.</span>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
