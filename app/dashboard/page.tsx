"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TopResponsesSection from '@/app/components/dashboard/TopResponsesSection';
import RecentActivitySection from '@/app/components/dashboard/RecentActivitySection';
import { SubmitResponseSidebar } from '@/app/components/dashboard/SubmitResponseSidebar';
import { useGetTodayPromptQuery, useGetWaitlistDashboardQuery, useGetMyLeaderboardQuery } from '@/features/api/apiSlice';
import type { TodayPrompt } from '@/lib/api/prompts.types';
import { getCompetitionLifecycle } from '@/lib/competition-lifecycle';

function useTimeLeft(prompt: TodayPrompt | undefined): string {
  if (!prompt) return "";
  const end = new Date(prompt.promptDate).getTime() + 24 * 60 * 60 * 1000;
  const diff = end - Date.now();
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours >= 1) return `${hours}h left`;
  const mins = Math.floor(diff / (1000 * 60));
  return `${mins}m left`;
}

function TodayPromptSkeleton() {
  return (
    <section className="bg-[#fbf6f3] rounded-[12px] p-6 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.11)] border border-neutral-200/40 relative overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 animate-pulse">
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-28 bg-neutral-300/50 rounded" />
          <div className="h-5 w-16 bg-neutral-200/60 rounded-full" />
        </div>
        <div className="space-y-2.5">
          <div className="h-7 w-3/4 bg-neutral-300/50 rounded" />
          <div className="h-7 w-1/2 bg-neutral-300/40 rounded" />
          <div className="h-4 w-56 bg-neutral-200/50 rounded mt-1" />
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <div className="h-10 w-40 bg-neutral-800/20 rounded-[8px]" />
          <div className="h-6 w-28 bg-neutral-300/40 rounded" />
        </div>
      </div>
      <div className="w-full sm:w-56 h-36 bg-neutral-200/40 rounded-[8px]" />
    </section>
  );
}

export default function DashboardPage() {
  const { data: prompt, isLoading } = useGetTodayPromptQuery();
  const { data: dashboard } = useGetWaitlistDashboardQuery();
  const { data: myLeaderboard } = useGetMyLeaderboardQuery("participation");
  const [submitOpen, setSubmitOpen] = useState(false);
  const timeLeft = useTimeLeft(prompt);
  const lifecycle = getCompetitionLifecycle(dashboard?.competition);
  const promptOpen = Boolean(prompt && lifecycle.promptCtaEnabled);
  const activePrompt = promptOpen ? prompt : null;

  // Compute real progress from API data
  const breakdown = myLeaderboard?.meta?.breakdown;
  const stepDone = [
    // Step 1: Participated in at least one daily prompt
    (breakdown?.promptPoints ?? 0) > 0 || (breakdown?.participationPoints ?? 0) > 0,
    // Step 2: Invited at least one friend
    (dashboard?.referrals?.directInvites ?? 0) > 0,
    // Step 3: Earned invite/referral rewards (invite points credited)
    (breakdown?.invitePoints ?? 0) > 0,
    // Step 4: City unlocked — competition is active/exists
    dashboard?.competition != null,
  ];
  const completedCount = stepDone.filter(Boolean).length;
  const progressPct = Math.round((completedCount / stepDone.length) * 100);

  return (
    <>
      {/* SEO Optimization */}
      <title>Ambassador Dashboard - Bea Website</title>
      <meta name="description" content="View your Bea Ambassador Dashboard, see daily prompts, track your progress, and check top responses from your community." />

      {/* MAIN DASHBOARD PANEL */}
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <section className="bg-[#f2eee7] border border-neutral-200/70 rounded-[10px] px-5 py-4">
          <p className="font-sfpro text-[11px] md:text-[14px] font-bold tracking-[0.12em] uppercase text-[#584939]">
            {lifecycle.bannerTitle}
          </p>
          <p className="font-lato text-[12px] md:text-[15px] font-semibold text-neutral-600 mt-1">
            {lifecycle.bannerBody}
          </p>
        </section>

        {/* TODAY'S PROMPT CARD */}
        {isLoading ? (
          <TodayPromptSkeleton />
        ) : !promptOpen ? (
          <section className="bg-[#fbf6f3] rounded-[12px] p-6 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-neutral-200/40 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-sfpro text-[12px] md:text-[18px] font-bold tracking-[0.05em] text-[#4c3b34] uppercase">
                Today&apos;s Prompt
              </span>
              <span className="bg-[#efebe5] text-[#9f947e] font-lato text-[10px] md:text-[14px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                Closed
              </span>
            </div>
            <h2 className="text-[20px] md:text-[24px] font-canela text-[#332822] tracking-tight leading-tight">
              No active prompt
            </h2>
            <p className="text-[12px] md:text-[16px] font-lato font-medium text-neutral-500 max-w-xl leading-relaxed">
              {lifecycle.scoringOpen
                ? "There is no prompt scheduled for today yet."
                : "Prompt scoring is closed for the current competition phase."}
            </p>
          </section>
        ) : (
          <section className="bg-[#fbf6f3] rounded-[12px] p-6 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.11)] border border-neutral-200/40 relative overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300">
            {/* Left Side Info */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-sfpro text-[12px] md:text-[18px] font-bold tracking-[0.05em] text-[#4c3b34] uppercase">
                  Today&apos;s Prompt
                </span>
                {timeLeft && (
                  <span className="bg-[#efebe5] text-[#9f947e] font-lato text-[10px] md:text-[14px] font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                    {timeLeft}
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                <h2 className="text-[20px] md:text-[24px] font-canela text-[#332822] tracking-tight leading-tight">
                  {activePrompt?.title}
                </h2>
                {activePrompt?.description && (
                  <p className="text-[12px] md:text-[16px] font-lato font-medium text-neutral-500 max-w-sm leading-relaxed">
                    {activePrompt.description}
                  </p>
                )}
                {!activePrompt?.description && (
                  <p className="text-[12px] md:text-[18px] font-lato font-semibold text-neutral-500 max-w-sm leading-relaxed">
                    Share your best response and<br className="hidden sm:inline" />see what your community thinks
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => setSubmitOpen(true)}
                  disabled={!promptOpen}
                  className="bg-[#1b1b1b] hover:bg-black text-white font-lato text-[12px] md:text-[18px] font-bold px-5 py-2.5 rounded-[8px] shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Submit your response
                </button>
                <Link
                  href="/dashboard/today/all-responses"
                  className="font-lato text-[12px] md:text-[18px] font-bold text-neutral-800 hover:text-black flex items-center gap-1 group py-2 cursor-pointer"
                >
                  <span>See all responses</span>
                  <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Side Illustration */}
            <div className="w-full sm:w-56 h-36 flex items-center justify-center shrink-0 relative bg-gradient-to-tr from-[#faf8f5] to-transparent rounded-[8px] overflow-hidden self-center sm:self-auto border border-neutral-100/40">
              <Image
                src="/images/assets/chairs.png"
                alt="Chairs and table"
                fill
                sizes="(max-width: 640px) 100vw, 224px"
                className="object-contain p-2 select-none"
              />
            </div>
          </section>
        )}

        <TopResponsesSection variant="dashboard" promptId={prompt?.id} />
      </main>

      {/* SIDEBAR WIDGETS (RIGHT COLUMN) */}
      <aside className="w-full md:w-72 shrink-0 flex flex-col gap-6 self-start">

        {/* YOUR PROGRESS CARD */}
        <div className="bg-[#f6f4f1] rounded-[12px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-neutral-200/100 flex flex-col">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] md:text-[14px] font-sfpro font-bold tracking-[0.15em] text-[#695b54] uppercase">
                Your Progress
              </span>
              <h3 className="text-[32px] md:text-[48px] font-sfpro font-normal text-[#2b2b2b] leading-none tracking-[0.03em] mt-1">
                {progressPct}%
              </h3>
              <p className="text-[11px] md:text-[14px] font-lato font-semibold text-[#c1bebc] mt-1">
                {progressPct === 100 ? "You\'re all set! 🎉" : "Let\'s get to 100!"}
              </p>
            </div>

            <div className="w-full h-[7.5px] bg-[#ece8e4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4a3428] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* How it works section */}
          <div className="mt-8 space-y-4">
            <span className="text-[11px] md:text-[14px] font-lato font-bold tracking-[0.15em] text-neutral-500 uppercase block">
              How it works
            </span>

            {([
              { label: "Participate in daily prompts" },
              { label: "Invite friends" },
              { label: "Earn rewards" },
              { label: "Unlock your city" },
            ] as const).map((step, i) => {
              const done = stepDone[i];
              return (
                <div key={i} className="flex items-center justify-between group">
                  <div className={`flex items-center gap-3 transition-opacity ${done ? "" : "opacity-70 group-hover:opacity-100"}`}>
                    <div className="w-5.5 h-5.5 rounded-full bg-[#e1dad7] flex items-center justify-center text-[14px] md:text-[20px] font-bold text-neutral-700">
                      {i + 1}
                    </div>
                    <span className="font-lato text-[11px] md:text-[14px] font-bold text-neutral-700 group-hover:text-black transition-colors">
                      {step.label}
                    </span>
                  </div>
                  {done ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-[#427c49] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border-[1.5px] border-neutral-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Invite Friends */}
          <button className="mt-8 bg-[#eaeaea] hover:bg-[#dfdfdf] active:scale-[0.98] text-neutral-800 font-lato text-[13px] md:text-[18px] font-bold py-3.5 rounded-[8px] text-center transition-all duration-200 cursor-pointer shadow-sm">
            Invite friends
          </button>
        </div>

        <RecentActivitySection variant="dashboard" />
      </aside>

      {/* Submit Response Sidebar */}
      <SubmitResponseSidebar
        prompt={submitOpen ? (prompt ?? null) : null}
        onClose={() => setSubmitOpen(false)}
      />
    </>
  );
}
