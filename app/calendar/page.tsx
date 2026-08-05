"use client";

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function CalendarPage() {
    const markets = Array(10).fill({
        city: "New York",
        stateCode: "NY",
        progress: 85,
        statusText: "Almost there! You’re early.",
        date: "July 2026"
    });

    return (
        <div className="min-h-screen bg-[#f7f5f2] text-neutral-900 flex flex-col font-sans pb-24">
            {/* SEO Optimization */}
            <title>Launch Schedule - Bea Website</title>
            <meta name="description" content="View the Bea waitlist launch schedule progress across select markets. See launch dates, status updates, and progress percentages." />

            {/* Header / Navbar */}
            <Navbar activePage="calendar" fullWidth={true} />

            {/* Main Content Area */}
            <main className="w-full max-w-none px-5 md:px-10 lg:px-20 py-10 flex flex-col">

                {/* Header Group */}
                <div className="text-center space-y-3.5 max-w-2xl mx-auto">
                    {/* WAITLIST PROGRESS: SFProDisplay, 24px bold */}
                    <span
                        className="text-[18px] md:text-[24px] uppercase tracking-[0.1em] text-[#47352a] font-bold block"
                        style={{ fontFamily: 'var(--font-sfpro)' }}
                    >
                        WAITLIST PROGRESS
                    </span>

                    {/* Launch schedule: Canela, 60px regular */}
                    <h1 className="text-[40px] md:text-[60px] font-canela font-normal text-neutral-900 tracking-[0.04em] leading-tight">
                        Launch schedule
                    </h1>

                    {/* Description: Lato, 21px medium */}
                    <p className="text-[16px] md:text-[21px] font-sans font-medium text-[#4c4b4a] leading-relaxed">
                        We’re launching in select markets<br />
                        this summer with a full rollout in the fall.
                    </p>
                </div>

                {/* Table Header Section */}
                <div className="w-full mt-14 px-3 sm:px-5">
                    <div className="grid grid-cols-12 w-full text-left">
                        {/* MARKET: 12px bold sfprodisplay */}
                        <div className="col-span-5 md:col-span-4">
                            <span
                                className="text-[12px] uppercase tracking-wider font-bold text-black"
                                style={{ fontFamily: 'var(--font-sfpro)' }}
                            >
                                MARKET
                            </span>
                        </div>
                        {/* LAUNCH STATUS: 12px bold sfprodisplay */}
                        <div className="col-span-4 md:col-span-5 pl-1">
                            <span
                                className="text-[12px] uppercase tracking-wider font-bold text-black"
                                style={{ fontFamily: 'var(--font-sfpro)' }}
                            >
                                LAUNCH STATUS
                            </span>
                        </div>
                        {/* LAUNCH DATE: 12px bold sfprodisplay */}
                        <div className="col-span-3 text-left pl-2 sm:pl-6">
                            <span
                                className="text-[12px] uppercase tracking-wider font-bold text-black"
                                style={{ fontFamily: 'var(--font-sfpro)' }}
                            >
                                LAUNCH DATE
                            </span>
                        </div>
                    </div>
                </div>

                {/* List Cards Section */}
                <div className="w-full mt-2.5 space-y-2.5">
                    {markets.map((market, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 items-center bg-[#f7f5f2] border border-[#eeeae8] rounded-xl px-3 sm:px-5 py-4 w-full hover:bg-[#f5f3ef] transition-all cursor-pointer"
                        >
                            {/* Market column */}
                            <div className="col-span-5 md:col-span-4 flex flex-col justify-center text-left">
                                <span className="font-canela text-[15px] md:text-[18px] text-neutral-900 tracking-[0.05em] leading-tight">
                                    {market.city}
                                </span>
                                <span className="font-sans text-[11px] md:text-[13px] font-medium text-[#918f8c] mt-0.5">
                                    {market.stateCode}
                                </span>
                            </div>

                            {/* Launch Status column */}
                            <div className="col-span-4 md:col-span-5 flex flex-col justify-center text-left space-y-1">
                                <div className="flex items-center gap-2 pr-1 sm:pr-4">
                                    <div className="h-[8px] bg-[#e6e2da] rounded-full flex-grow overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: `${market.progress}%`, backgroundColor: '#47352a' }}
                                        />
                                    </div>
                                    <span className="font-sans text-[11px] md:text-[13px] font-semibold text-[#4c4b4a]/70">
                                        {market.progress}%
                                    </span>
                                </div>
                                <span className="font-sans text-[11px] md:text-[13px] font-bold text-[#7f7b79] leading-none">
                                    {market.statusText}
                                </span>
                            </div>

                            {/* Launch Date column */}
                            <div className="col-span-3 flex items-center justify-between pl-2 sm:pl-6">
                                <span className="font-sans text-[11px] md:text-[14px] font-bold text-[#4c4b4a]">
                                    {market.date}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-black flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

            </main>

        </div>
    );
}
