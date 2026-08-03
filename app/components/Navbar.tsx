"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    activePage?: 'faq' | 'ambassadors' | 'calendar' | 'home';
    fullWidth?: boolean;
}

export default function Navbar({ activePage = 'home', fullWidth = false }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`w-full flex items-center justify-between bg-transparent ${fullWidth
            ? "px-5 py-3 md:px-10 md:py-6 lg:px-16 lg:py-7"
            : "px-4 py-3 md:px-8 md:py-6 lg:px-14 lg:py-7 max-w-5xl mx-auto"
            }`}>
            {/* 1. Logo & Mobile Hamburger (Matches waitlist landing style) */}
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="md:hidden p-1 text-[#1a1a1a] hover:opacity-80 focus:outline-none cursor-pointer flex items-center justify-center"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>
                <Link
                    href="/waitlist"
                    className="select-none hover:opacity-85 transition-opacity leading-none flex items-center"
                >
                    <img src="/images/assets/Bea_png.png" alt="Bea Logo" className="h-6.5 md:h-9.5 w-auto object-contain" />
                </Link>
            </div>

            {/* 2. Group Links & CTA on the right */}
            <div className="flex items-center gap-5 md:gap-8">
                {/* Navigation Links - Hidden on mobile, visible on desktop */}
                <div className="hidden md:flex items-center gap-10 text-[#1a1a1a]">
                    <Link
                        href="/faq"
                        className={`text-[14px] font-sans font-medium transition-opacity whitespace-nowrap ${activePage === 'faq' ? 'opacity-100 font-bold' : 'opacity-75 hover:opacity-100'
                            }`}
                    >
                        FAQ
                    </Link>
                    <Link
                        href="/login"
                        className={`text-[14px] font-sans font-medium transition-opacity whitespace-nowrap ${activePage === 'ambassadors' ? 'opacity-100 font-bold' : 'opacity-75 hover:opacity-100'
                            }`}
                    >
                        Ambassadors
                    </Link>
                    <Link
                        href="/calendar"
                        className={`text-[14px] font-sans font-medium transition-opacity whitespace-nowrap ${activePage === 'calendar' ? 'opacity-100 font-bold' : 'opacity-75 hover:opacity-100'
                            }`}
                    >
                        Calendar
                    </Link>
                </div>

                {/* CTA Button */}
                <Link
                    href="/waitlist/start"
                    className="bg-[#1a1a1a] text-white text-[13px] md:text-[14px] font-sans font-semibold md:font-medium px-4.5 py-2.25 md:px-6 md:py-2.75 rounded-full hover:opacity-90 transition-all whitespace-nowrap"
                >
                    Join waitlist
                </Link>
            </div>

            {/* Mobile Drawer Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes slideIn {
                                from { transform: translateX(-100%); }
                                to { transform: translateX(0); }
                            }
                        `
                    }} />
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-neutral-950/40 backdrop-blur-[1px] transition-opacity duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    {/* Drawer Panel */}
                    <div
                        className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-[#fbf5ef] shadow-2xl flex flex-col p-5 text-left"
                        style={{
                            animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        }}
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-5 border-b border-[#e3ded6]">
                            <img src="/images/assets/Bea_png.png" alt="Bea Logo" className="h-6 w-auto object-contain" />
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-1 text-neutral-500 hover:text-neutral-800 focus:outline-none cursor-pointer"
                                aria-label="Close menu"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <div className="grow flex flex-col gap-1.5 py-6">
                            <Link
                                href="/faq"
                                onClick={() => setIsMenuOpen(false)}
                                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3.5 font-sans text-[14px] font-semibold transition-all duration-200 ${activePage === 'faq' ? 'bg-[#f2eee7]/80 text-black font-bold' : 'text-neutral-700 hover:text-black hover:bg-[#f2eee7]/50'
                                    }`}
                            >
                                FAQ
                            </Link>
                            <div className="h-px bg-[#e3ded6]/50 my-0.5" />
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3.5 font-sans text-[14px] font-semibold transition-all duration-200 ${activePage === 'ambassadors' ? 'bg-[#f2eee7]/80 text-black font-bold' : 'text-neutral-700 hover:text-black hover:bg-[#f2eee7]/50'
                                    }`}
                            >
                                Ambassadors
                            </Link>
                            <div className="h-px bg-[#e3ded6]/50 my-0.5" />
                            <Link
                                href="/calendar"
                                onClick={() => setIsMenuOpen(false)}
                                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3.5 font-sans text-[14px] font-semibold transition-all duration-200 ${activePage === 'calendar' ? 'bg-[#f2eee7]/80 text-black font-bold' : 'text-neutral-700 hover:text-black hover:bg-[#f2eee7]/50'
                                    }`}
                            >
                                Calendar
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}