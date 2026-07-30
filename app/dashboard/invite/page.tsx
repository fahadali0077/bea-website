"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InviteShareChannels from '@/app/components/dashboard/InviteShareChannels';
import { useGetWaitlistDashboardQuery } from '@/features/api/apiSlice';
import { getCompetitionLifecycle } from '@/lib/competition-lifecycle';

export default function InvitePage() {
    const [copied, setCopied] = useState(false);
    const { data: dashboard } = useGetWaitlistDashboardQuery();
    const referralLink = dashboard?.user.referralLink ?? 'https://datebea.com/waitlist';
    const directInvites = dashboard?.referrals.directInvites ?? 0;
    const shareTitle = 'Join me on Bea and unlock perks together!';
    const lifecycle = getCompetitionLifecycle(dashboard?.competition);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    return (
        <main className="flex-1 flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto w-full">
            <title>Invite Friends - Ambassador Dashboard</title>
            <meta name="description" content="Invite friends to unlock perks, earn points, and unlock your city faster." />

            {/* HEADER */}
            <div className="space-y-1">
                <h1 className="text-[28px] md:text-[48px] font-canela font-normal text-neutral-900 leading-tight whitespace-nowrap">
                    Invite friends
                </h1>
                <div className="text-[12px] md:text-[18px] font-sans font-medium tracking-[0.01em] text-neutral-500 space-y-0.5 mt-2">
                    <p>Invite friends to unlock perks.</p>
                    <p>You earn points, city unlocks faster.</p>
                </div>
            </div>

            <section className="bg-[#f2eee7] border border-neutral-200/70 rounded-[10px] px-5 py-4 max-w-[640px]">
                <p className="font-sfpro text-[11px] md:text-[14px] font-bold tracking-[0.12em] uppercase text-[#584939]">
                    {lifecycle.bannerTitle}
                </p>
                <p className="font-lato text-[12px] md:text-[15px] font-semibold text-neutral-600 mt-1">
                    {lifecycle.bannerBody}
                </p>
            </section>

            {/* PROGRESS CARD & BANNER GROUP */}
            <div className="flex flex-col gap-4.5 max-w-[480px]">
                {/* PROGRESS CARD */}
                <div className="bg-[#f4f0ec] border border-[#e3ded6] rounded-[12px] p-4 md:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.07)] flex justify-between items-center w-full">
                    {/* Left Info Column */}
                    <div className="flex-1 flex flex-col gap-1 pr-3">
                        <span className="font-sfpro text-[13px] font-medium tracking-[0.05em] text-[#3D2C24] uppercase">
                            Your Progress
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="font-sans text-[18px] md:text-[24px] font-black text-neutral-900 leading-none">{directInvites}</span>
                            <span className="font-sans text-[12px] md:text-[18px] font-medium text-neutral-900 leading-none">/ 3 invited</span>
                        </div>
                        {/* Custom Progress Bar */}
                        <div className="w-full max-w-[190px] h-[5px] bg-neutral-200/70 rounded-full overflow-hidden mt-1.5">
                            <div className="w-[66%] h-full bg-[#4a3429] rounded-full" />
                        </div>
                        {/* Points Highlight */}
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="font-sans text-[14px] font-medium text-neutral-800 leading-none">
                                +20 points earned
                            </span>
                            <div className="relative w-3.5 h-3.5 shrink-0">
                                <Image src="/images/assets/trophy.png" alt="Trophy" fill className="object-contain" />
                            </div>
                        </div>
                        {/* Helper subtext */}
                        <span className="font-sans text-[14px] font-medium text-neutral-400 mt-3 leading-none whitespace-nowrap block">
                            1 friend until you unlock Premium
                        </span>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-[1px] h-16 md:h-24 bg-neutral-200/60 shrink-0" />

                    {/* Right Points History Column */}
                    <div className="flex-1 flex flex-col items-center justify-center pl-3 select-none">
                        {/* Gift Circular Badge */}
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#faf0eb] border border-neutral-100 flex items-center justify-center shadow-[0_4px_12px_rgba(208,80,56,0.05)]">
                            <div className="relative w-4.5 h-4.5 md:w-5.5 md:h-5.5 shrink-0">
                                <Image src="/images/assets/reward.png" alt="Reward" fill className="object-contain" />
                            </div>
                        </div>
                        {/* Points History Link */}
                        <Link
                            href="/dashboard/invite/points-history"
                            className="font-sans text-[10px] font-bold text-neutral-800 underline uppercase tracking-widest mt-2 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                            Points history
                        </Link>
                    </div>
                </div>

                {/* EARNING BANNER */}
                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f2eee7] border border-neutral-200/10 rounded-full text-[11px] md:text-[14px] font-medium text-neutral-700 w-full shadow-[0_2px_8px_rgba(0,0,0,0.005)]">
                    <div className="relative w-3 h-3 md:w-3.5 md:h-3.5 shrink-0">
                        <Image src="/images/assets/trophy.png" alt="Trophy" fill className="object-contain" />
                    </div>
                    <span>
                        {lifecycle.scoringOpen ? (
                            <>You earn <span className="text-[#d05038] font-black">+10 points</span> for every friend who joins</>
                        ) : (
                            <>Sharing still works, but competition points are closed</>
                        )}
                    </span>
                </div>
            </div>

            {/* TWO-COLUMN PANEL */}
            <section className="bg-[#f4f0ec] border border-[#e3ded6] rounded-[12px] p-5 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 w-full">
                {/* COLUMN 1: Your invite link */}
                <div className="flex flex-col md:border-r md:border-[#e3ded6] md:pr-6 lg:pr-8">
                    <h2 className="text-[14px] md:text-[18px] font-sfpro font-medium text-neutral-900 leading-none">
                        Your invite link
                    </h2>
                    <p className="text-[11px] md:text-[14px] font-sans font-medium text-neutral-400 mt-2 leading-relaxed">
                        Share your link. Get points and perks for every friend who joins.
                    </p>

                    {/* Integrated referral input link with Copy Button */}
                    <div className="bg-[#fcfaf7] border border-neutral-200/60 rounded-[8px] pl-3 pr-1 py-1 flex items-center justify-between w-full mt-4 shadow-inner">
                        <span className="font-sans font-medium text-[11px] md:text-[14px] text-neutral-800 select-all truncate pr-2">
                            {referralLink.replace(/^https?:\/\//, '')}
                        </span>
                        <button
                            onClick={handleCopy}
                            className={`text-[11px] md:text-[14px] font-sans font-bold uppercase tracking-widest px-3 md:px-4 py-2 md:py-2.5 rounded-[6px] transition-all duration-200 cursor-pointer text-white shadow-sm shrink-0 ${copied
                                ? 'bg-[#3b9347] hover:bg-[#3b9347]/90'
                                : 'bg-black hover:bg-neutral-800'
                                }`}
                        >
                            {copied ? 'Copied!' : 'Copy link'}
                        </button>
                    </div>

                    <span className="font-sfpro text-[14px] font-medium text-black mt-8 block">
                        Share via
                    </span>
                    <InviteShareChannels
                        shareUrl={referralLink}
                        shareTitle={shareTitle}
                    />
                </div>

                {/* COLUMN 2: Invite Rewards */}
                <div className="flex flex-col">
                    <h2 className="text-[14px] md:text-[18px] font-sfpro font-medium text-neutral-900 leading-none">
                        Invite Rewards
                    </h2>
                    <p className="text-[11px] md:text-[14px] font-sans font-medium text-[#7c7c7c] mt-2 leading-relaxed">
                        Unlock app perks as you invite friends.
                    </p>

                    {/* Timeline Container */}
                    <div className="relative flex flex-col gap-6.5 mt-5 pl-1.5">
                        {/* Dashed line background */}
                        <div className="absolute left-4.5 top-5 bottom-5 w-0 border-l-[1.5px] border-dashed border-neutral-300 z-0" />

                        {/* Step 1: Early Access */}
                        <div className="flex items-center justify-between z-10 w-full">
                            <div className="flex items-center gap-3">
                                {/* Completed Step Circle */}
                                <div className="w-6.5 h-6.5 rounded-full bg-[#4a3429] text-white flex items-center justify-center shadow-sm shrink-0">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold text-neutral-800 leading-tight">
                                        Early Access
                                    </span>
                                    <span className="font-sans text-[11px] md:text-[14px] font-medium text-[#7c7c7c] mt-0.5 leading-none">
                                        Be in the first cohort to launch
                                    </span>
                                </div>
                            </div>
                            <span className="font-sans text-[11px] md:text-[14px] font-bold text-[#827357] bg-[#f2eee7] w-[76px] md:w-[90px] py-1 rounded-full uppercase tracking-wider shrink-0 select-none text-center">
                                1 friend
                            </span>
                        </div>

                        {/* Step 2: Time pack */}
                        <div className="flex items-center justify-between z-10 w-full">
                            <div className="flex items-center gap-3">
                                {/* Completed Step Circle */}
                                <div className="w-6.5 h-6.5 rounded-full bg-[#4a3429] text-white flex items-center justify-center shadow-sm shrink-0">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold text-neutral-800 leading-tight">
                                        Time pack
                                    </span>
                                    <span className="font-sans text-[11px] md:text-[14px] font-medium text-[#7c7c7c] mt-0.5 leading-none">
                                        Extend conversations for 24 hours.
                                    </span>
                                </div>
                            </div>
                            <span className="font-sans text-[11px] md:text-[14px] font-bold text-[#827357] bg-[#f2eee7] w-[76px] md:w-[90px] py-1 rounded-full uppercase tracking-wider shrink-0 select-none text-center">
                                2 friends
                            </span>
                        </div>

                        {/* Step 3: 1 month Premium */}
                        <div className="flex items-center justify-between z-10 w-full">
                            <div className="flex items-center gap-3">
                                {/* Incompleted Step Circle */}
                                <div className="w-6.5 h-6.5 rounded-full bg-[#faefe6] text-neutral-700 flex items-center justify-center shadow-sm shrink-0 font-sans text-[12px] md:text-[14px] font-bold">
                                    3
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold text-neutral-800 leading-tight">
                                        1 month Premium
                                    </span>
                                    <span className="font-sans text-[11px] md:text-[14px] font-medium text-[#7c7c7c] mt-0.5 leading-none">
                                        Enjoy 1 month of premium, on us.
                                    </span>
                                </div>
                            </div>
                            <span className="font-sans text-[11px] md:text-[14px] font-bold text-[#827357] bg-[#f2eee7] w-[76px] md:w-[90px] py-1 rounded-full uppercase tracking-wider shrink-0 select-none text-center">
                                3 friends
                            </span>
                        </div>
                    </div>

                    {/* Progress indicator at bottom of rewards */}
                    <div className="mt-8 pt-4 border-t border-neutral-200/40 w-full">
                        <span className="font-sans text-[14px] md:text-[18px] font-medium text-neutral-800 block leading-none">
                            2/3 invited
                        </span>
                        <div className="w-full h-[5px] bg-neutral-200/70 rounded-full overflow-hidden mt-2">
                            <div className="w-[66%] h-full bg-[#4a3429] rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* YOUR INVITE IMPACT */}
            <section className="bg-[#fbfbf9] border border-[#f4f0ec] rounded-[12px] p-5 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)] w-full">
                <h2 className="text-[14px] md:text-[18px] font-sfpro font-medium text-neutral-900 leading-none">
                    Your invite impact
                </h2>
                <p className="text-[11px] md:text-[14px] font-sans font-medium text-neutral-400 mt-2 leading-relaxed">
                    Thank you for helping us create a community.
                </p>

                {/* Grid Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
                    {/* ACTIVITY CARD */}
                    <div className="bg-[#fdfcfb] border border-[#f8f1eb] rounded-[8px] p-4.5 md:p-5.5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.005)]">
                        <span className="font-sans text-[12px] font-bold text-black uppercase mb-4 md:mb-5 block">
                            YOUR ACTIVITY
                        </span>

                        <div className="flex flex-col gap-3.5">
                            {/* Invites sent */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-neutral-700">
                                    <div className="relative w-4 h-4 shrink-0">
                                        <Image src="/images/assets/invites.png" alt="Invites sent icon" fill className="object-contain" />
                                    </div>
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold tracking-[0.01em]">Invites sent</span>
                                </div>
                                <span className="font-minionvariable font-bold text-[18px] md:text-[24px] text-neutral-900 leading-none">2</span>
                            </div>

                            {/* Divider line */}
                            <div className="h-[1px] bg-neutral-200/40 w-full" />

                            {/* Points Earned */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-neutral-700">
                                    <div className="relative w-4 h-4 shrink-0">
                                        <Image src="/images/assets/points_earned.png" alt="Points earned icon" fill className="object-contain" />
                                    </div>
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold tracking-[0.01em]">Points Earned</span>
                                </div>
                                <span className="font-minionvariable font-bold text-[18px] md:text-[24px] text-neutral-900 leading-none">20</span>
                            </div>

                            {/* Divider line */}
                            <div className="h-[1px] bg-neutral-200/40 w-full" />

                            {/* Rewards Unlocked */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-neutral-700">
                                    <div className="relative w-4 h-4 shrink-0">
                                        <Image src="/images/assets/reward.png" alt="Rewards unlocked icon" fill className="object-contain" />
                                    </div>
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold tracking-[0.01em]">Rewards Unlocked</span>
                                </div>
                                <span className="font-minionvariable font-bold text-[18px] md:text-[24px] text-neutral-900 leading-none">2/3</span>
                            </div>
                        </div>
                    </div>

                    {/* STANDING CARD */}
                    <div className="bg-[#fdfcfb] border border-[#f8f1eb] rounded-[8px] p-4.5 md:p-5.5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.005)]">
                        <span className="font-sans text-[12px] font-bold text-black uppercase mb-4 md:mb-5 block">
                            YOUR STANDING
                        </span>

                        <div className="flex flex-col gap-3.5">
                            {/* Campus Rank */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-neutral-700">
                                    <div className="relative w-4 h-4 shrink-0">
                                        <Image src="/images/assets/campus.png" alt="Campus rank icon" fill className="object-contain" />
                                    </div>
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold tracking-[0.01em]">Campus Rank</span>
                                </div>
                                <span className="font-minionvariable font-bold text-[18px] md:text-[24px] text-neutral-900 leading-none">#2</span>
                            </div>

                            {/* Divider line */}
                            <div className="h-[1px] bg-neutral-200/40 w-full" />

                            {/* Market Rank */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-neutral-700">
                                    <div className="relative w-4 h-4 shrink-0">
                                        <Image src="/images/assets/market.png" alt="Market rank icon" fill className="object-contain" />
                                    </div>
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold tracking-[0.01em]">Market Rank</span>
                                </div>
                                <span className="font-minionvariable font-bold text-[18px] md:text-[24px] text-neutral-900 leading-none">#10</span>
                            </div>

                            {/* Divider line */}
                            <div className="h-[1px] bg-neutral-200/40 w-full" />

                            {/* National Rank */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-neutral-700">
                                    <div className="relative w-4 h-4 shrink-0">
                                        <Image src="/images/assets/national.png" alt="National rank icon" fill className="object-contain" />
                                    </div>
                                    <span className="font-sans text-[12px] md:text-[14px] font-bold tracking-[0.01em]">National Rank</span>
                                </div>
                                <span className="font-minionvariable font-bold text-[18px] md:text-[24px] text-neutral-900 leading-none">#200</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Center Sparkle Badge */}
                <div className="flex justify-center w-full mt-6">
                    <div className="inline-flex items-center gap-2 justify-center px-4 py-2.5 bg-[#faf0e8] rounded-[6px] text-[11px] md:text-[14px] font-medium text-neutral-700 w-full max-w-[920px] select-none text-center shadow-[0_2px_8px_rgba(0,0,0,0.005)]">
                        <svg className="w-3.5 h-3.5 text-[#d05038] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904zM18 10.5a.5.5 0 01-.5-.5.5.5 0 01-.5-.5.5.5 0 01.5-.5c0-.276.224-.5.5-.5s.5.224.5.5a.5.5 0 01.5.5.5.5 0 01-.5.5c0 .276-.224.5-.5.5z" />
                        </svg>
                        <span>Every friend brings us closer to unlocking your city. Thank you!</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
