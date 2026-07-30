"use client";

import React, { useState } from "react";
import Image from "next/image";

import { useGetMyLeaderboardQuery } from "@/features/api/apiSlice";
import type { LeaderboardEntry, LeaderboardScope } from "@/lib/api/types";
import { getCompetitionLifecycle } from "@/lib/competition-lifecycle";

const scopeLabels: Record<LeaderboardScope, string> = {
  campus: "Campus",
  market: "Market",
  national: "National",
  participation: "Participation",
};

const formatTimeLeft = (endDate?: string) => {
  if (!endDate) return "No active competition";
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}d ${hours}h`;
};

const rankBadge = (rank: number) => {
  if (rank > 3) {
    return <span className="font-sfpro text-[12px] md:text-[18px] font-bold text-neutral-500 pl-2">{rank}</span>;
  }

  const fills = {
    1: ["#caa138", "#dfb33e", "#e5c158"],
    2: ["#8d8d8d", "#a8a8a8", "#c0c0c0"],
    3: ["#935b30", "#af6f3b", "#cd7f32"],
  } as const;
  const [dark, mid, light] = fills[rank as 1 | 2 | 3];

  return (
    <svg className="w-7 h-7 md:w-11 md:h-11 shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M9 13.5V21L12 19.5L15 21V13.5" fill={dark} opacity="0.85" />
      <path d="M12 13.5V21L15 19.5L18 21V13.5" fill={mid} opacity="0.85" />
      <circle cx="12" cy="10" r="7" fill={light} stroke={dark} strokeWidth="1.2" />
      <circle cx="12" cy="10" r="5.2" fill={mid} />
      <text x="12" y="13" fontFamily="var(--font-sans), sans-serif" fontSize="9" fontWeight="950" fill="white" textAnchor="middle">
        {rank}
      </text>
    </svg>
  );
};

const rowName = (item: LeaderboardEntry) => item.fullName || "Anonymous";

const movementBadge = (item: Pick<LeaderboardEntry, "rankMovement" | "rankMovementDirection" | "rankMovementLabel">) => {
  const direction = item.rankMovementDirection ?? "NEW";
  if (direction === "NEW") {
    return <span className="font-lato text-[12px] md:text-[15px] font-bold text-[#5576ee]">New</span>;
  }
  if (direction === "UP") {
    const val = item.rankMovement;
    const formatted = val > 0 ? `+${val}` : `+${Math.abs(val)}`;
    return <span className="font-lato text-[12px] md:text-[15px] font-bold text-emerald-600">{formatted}</span>;
  }
  if (direction === "DOWN") {
    const val = item.rankMovement;
    const formatted = val < 0 ? `${val}` : `-${Math.abs(val)}`;
    return <span className="font-lato text-[12px] md:text-[15px] font-bold text-red-600">{formatted}</span>;
  }
  return <span className="font-lato text-[12px] md:text-[15px] font-bold text-neutral-400">0</span>;
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardScope>("campus");
  const { data, isLoading, isFetching, error } = useGetMyLeaderboardQuery(activeTab);

  const meta = data?.meta;
  const lifecycle = getCompetitionLifecycle(meta?.competition);
  const rows = data?.leaderboard ?? [];
  const scopeName = meta?.scopeName ?? scopeLabels[activeTab];
  const rankLabel = meta?.userRank ? `#${meta.userRank}` : "-";
  const totalPoints = meta?.totalPoints ?? 0;
  const promptPoints = meta?.breakdown.promptPoints ?? 0;
  const participationPoints = meta?.breakdown.participationPoints ?? 0;
  const invitePoints = meta?.breakdown.invitePoints ?? 0;
  const rankMovement = meta?.rankMovement ?? 0;
  const rankMovementDirection = meta?.rankMovementDirection ?? "NEW";
  const rankBasisLabel = meta?.rankBasis === "participation" ? "Participation Points" : "Total Points";

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8">
      <title>Leaderboard - Ambassador Dashboard</title>
      <meta name="description" content="Track ranks and total points of universities and student ambassadors nationwide." />

      <div className="space-y-1">
        <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-[0.03em] text-neutral-900 leading-tight">
          Leaderboard
        </h1>
        <p className="text-[12px] md:text-[18px] font-lato font-medium tracking-[0.03em] text-neutral-500">
          See who&apos;s leading the waitlist experience.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mt-1">
        <div className="flex items-center gap-2 w-full sm:max-w-md md:max-w-lg">
          {(["campus", "market", "national", "participation"] as LeaderboardScope[]).map((scope) => (
            <button
              key={scope}
              type="button"
              onClick={() => setActiveTab(scope)}
              className={`flex-1 text-center font-lato font-black text-[9px] md:text-[12px] uppercase tracking-wider py-2.5 rounded-[4px] transition-all duration-200 cursor-pointer shadow-sm ${
                activeTab === scope
                  ? "bg-[#584939] text-white border border-[#584939]"
                  : "bg-white text-neutral-500 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-800"
              }`}
            >
              {scopeLabels[scope]}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-auto rounded-[8px] border border-neutral-200/80 bg-[#fbfbf9] px-4 py-2.5 font-lato text-[12px] md:text-[18px] font-medium text-neutral-800 shadow-sm">
          {scopeName}
        </div>
      </div>

      {error ? (
        <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          Unable to load this leaderboard. Make sure your profile has a school and market for campus or market views.
        </div>
      ) : null}

      <section className="bg-[#f2eee7] border border-neutral-200/70 rounded-[10px] px-5 py-4">
        <p className="font-sfpro text-[11px] md:text-[14px] font-bold tracking-[0.12em] uppercase text-[#584939]">
          {lifecycle.bannerTitle}
        </p>
        <p className="font-lato text-[12px] md:text-[15px] font-semibold text-neutral-600 mt-1">
          {lifecycle.bannerBody}
        </p>
      </section>

      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col gap-6 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-full bg-[#efebe5] flex items-center justify-center shrink-0">
            <svg className="w-5.5 h-5.5 text-[#584939]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M2.25 21h19.5" />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="font-lato text-[16px] md:text-[24px] font-medium text-neutral-800 block leading-none truncate">
              {scopeName}
            </span>
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-neutral-500 mt-1.5 block leading-none">
              {meta?.scopeLabel ?? `${scopeLabels[activeTab]} Competition`}
            </span>
          </div>
        </div>

        <div className="h-[1px] bg-neutral-200/60 w-full" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start w-full">
          <div className="flex flex-col">
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-neutral-500 leading-none">Your Rank</span>
            <span className="font-minion text-[40px] md:text-[60px] font-bold text-[#054d5a] leading-none mt-2">{rankLabel}</span>
            <span className="mt-2">{movementBadge({ rankMovement, rankMovementDirection })}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-neutral-500 leading-none">Total Participants</span>
            <span className="font-lato text-[16px] md:text-[24px] font-bold text-black mt-2.5 leading-none">{meta?.totalParticipants ?? 0}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-neutral-500 leading-none">Your Points</span>
            <span className="font-lato text-[16px] md:text-[24px] font-bold text-black mt-2.5 leading-none">{totalPoints.toLocaleString()}</span>
            <span className="font-lato text-[10px] md:text-[12px] font-medium text-neutral-400 mt-2">
              {promptPoints} prompt / {participationPoints} participation / {invitePoints} invite
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-neutral-500 leading-none">Competition Ends</span>
            <span className="font-lato text-[16px] md:text-[24px] font-bold text-neutral-800 mt-2.5 leading-none">
              {lifecycle.status === "GRACE_PERIOD" ? "Locked" : formatTimeLeft(meta?.competition?.endDate)}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfbf9] border border-neutral-200/40 rounded-[12px] p-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] w-full">
        <div className="overflow-x-auto no-scrollbar w-full">
          <div className="min-w-[860px] md:min-w-[1040px] flex flex-col gap-0.5">
            <div className="grid grid-cols-[70px_100px_1fr_110px_100px_140px_120px] md:grid-cols-[90px_120px_1fr_130px_120px_170px_150px] gap-4 items-center pb-3 border-b border-neutral-200/60 font-sfpro text-[11px] md:text-[16px] font-bold text-[#402b23] uppercase tracking-widest">
              <span>Rank</span>
              <span>Move</span>
              <span>Name</span>
              <span>Prompts</span>
              <span>Invites</span>
              <span>Participation</span>
              <span>{rankBasisLabel}</span>
            </div>

            {isLoading || isFetching ? (
              <div className="py-8 text-center text-sm font-semibold text-neutral-500">Loading leaderboard...</div>
            ) : rows.length ? (
              rows.map((item) => (
                <div key={item.userId} className="grid grid-cols-[70px_100px_1fr_110px_100px_140px_120px] md:grid-cols-[90px_120px_1fr_130px_120px_170px_150px] gap-4 items-center py-4 border-b border-neutral-200/30 last:border-0 hover:bg-neutral-50/40 transition-colors duration-150">
                  <div className="flex items-center pl-1">{rankBadge(item.rank)}</div>
                  <div>{movementBadge(item)}</div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-7.5 h-7.5 rounded-full overflow-hidden border border-neutral-200/70 shadow-sm bg-neutral-100 flex items-center justify-center shrink-0">
                      <Image src="/images/ron-avatar.png" alt="" fill sizes="30px" className="object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-lato text-[15px] md:text-[24px] font-medium text-black truncate">{rowName(item)}</span>
                      <span className="font-lato text-[11px] md:text-[18px] font-medium text-neutral-400 truncate mt-0.5">
                        {activeTab === "market" ? item.market : item.school || item.market || "National"}
                      </span>
                    </div>
                  </div>
                  <span className="font-lato text-[15px] md:text-[24px] font-medium text-black">{item.promptPoints.toLocaleString()}</span>
                  <span className="font-lato text-[15px] md:text-[24px] font-medium text-black">{item.invitePoints.toLocaleString()}</span>
                  <span className="font-lato text-[15px] md:text-[24px] font-medium text-black">{item.participationPoints.toLocaleString()}</span>
                  <span className="font-lato text-[15px] md:text-[24px] font-medium text-black">
                    {(meta?.rankBasis === "participation" ? item.participationPoints : item.totalPoints).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm font-semibold text-neutral-500">No leaderboard points yet.</div>
            )}
          </div>
        </div>

        <span className="font-minion text-[10px] md:text-[14px] text-neutral-400 mt-6 text-center block w-full">
          You are ranked <span className="font-bold text-[#5576ee]">{rankLabel}</span> in this view.
        </span>
      </section>
    </main>
  );
}
