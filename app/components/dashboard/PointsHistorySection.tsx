"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WAITLIST_PRIZES_DETAIL } from "@/lib/waitlist-page-content";

const INITIAL_VISIBLE = 10;
const LOAD_MORE_COUNT = 8;
const TOTAL_HISTORY = 48;

interface PointsHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  timeAgo: string;
  type: "earn" | "redeem";
  icon: string;
}

const HISTORY_TEMPLATES: Omit<PointsHistoryItem, "id" | "timeAgo">[] = [
  {
    title: "Friend joined via your link",
    subtitle: "Invite friends",
    points: 10,
    type: "earn",
    icon: "/images/assets/invites.png",
  },
  {
    title: "Answered daily prompt",
    subtitle: "Daily prompt competition",
    points: 5,
    type: "earn",
    icon: "/images/assets/points_earned.png",
  },
  {
    title: "Gave a like",
    subtitle: "Community engagement",
    points: 5,
    type: "earn",
    icon: "/images/assets/trophy.png",
  },
  {
    title: "Wrote a comment",
    subtitle: "Community engagement",
    points: 5,
    type: "earn",
    icon: "/images/assets/reward.png",
  },
  {
    title: "Campus prompt winner bonus",
    subtitle: "Prompt points breakdown",
    points: 25,
    type: "earn",
    icon: "/images/assets/campus.png",
  },
  {
    title: "Redeemed Annual Premium Membership",
    subtitle: "Rewards",
    points: -1200,
    type: "redeem",
    icon: "/images/assets/reward.png",
  },
];

function buildHistoryItems(): PointsHistoryItem[] {
  return Array.from({ length: TOTAL_HISTORY }, (_, i) => {
    const template = HISTORY_TEMPLATES[i % HISTORY_TEMPLATES.length];
    const hours = i + 1;
    const timeAgo =
      hours < 24
        ? `${hours}h ago`
        : hours < 48
          ? "Yesterday"
          : `${Math.floor(hours / 24)}d ago`;

    return {
      id: `history-${i + 1}`,
      ...template,
      timeAgo,
    };
  });
}

function HistoryRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-200/40 animate-pulse">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-full bg-neutral-200/60 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 bg-neutral-200/50 rounded" />
          <div className="h-3 w-28 bg-neutral-200/40 rounded" />
        </div>
      </div>
      <div className="h-5 w-12 bg-neutral-200/50 rounded shrink-0" />
    </div>
  );
}

function HistoryRow({ item }: { item: PointsHistoryItem }) {
  const isEarn = item.type === "earn";

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-200/40 last:border-0 hover:bg-neutral-50/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-full bg-[#faf0eb] border border-neutral-100 flex items-center justify-center shrink-0">
          <div className="relative w-4 h-4">
            <Image src={item.icon} alt="" fill className="object-contain" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-sans text-[13px] md:text-[15px] font-bold text-neutral-900 leading-tight truncate">
            {item.title}
          </p>
          <p className="font-sans text-[11px] md:text-[13px] font-medium text-neutral-500 mt-0.5">
            {item.subtitle} · {item.timeAgo}
          </p>
        </div>
      </div>
      <span
        className={`font-minionvariable font-bold text-[16px] md:text-[20px] leading-none shrink-0 ${
          isEarn ? "text-[#3b9347]" : "text-[#d05038]"
        }`}
      >
        {isEarn ? "+" : ""}
        {item.points.toLocaleString()}
      </span>
    </div>
  );
}

export default function PointsHistorySection() {
  const totalPoints = WAITLIST_PRIZES_DETAIL.points.value;

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const historyItems = useMemo(() => buildHistoryItems(), []);
  const displayedItems = useMemo(
    () => historyItems.slice(0, visibleCount),
    [historyItems, visibleCount]
  );
  const hasMoreToLoad = visibleCount < historyItems.length;

  useEffect(() => {
    if (!hasMoreToLoad) return;

    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isLoadingMore) return;

        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, historyItems.length));
          setIsLoadingMore(false);
        }, 600);
      },
      { rootMargin: "120px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreToLoad, isLoadingMore, historyItems.length]);

  return (
    <section className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/invite"
          className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-neutral-200 bg-[#faf9f6] text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all shrink-0"
          aria-label="Back to invite friends"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-tight text-neutral-900 leading-tight">
            Points history
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            Every point you&apos;ve earned and redeemed
          </p>
        </div>
      </div>

      <div className="bg-[#f4f0ec] border border-[#e3ded6] rounded-[12px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-sfpro text-[12px] md:text-[14px] font-medium tracking-[0.05em] text-[#3D2C24] uppercase">
              Current balance
            </p>
            <p className="font-sans text-[28px] md:text-[40px] font-black text-neutral-900 leading-none mt-1">
              {totalPoints}
            </p>
            <p className="font-sans text-[12px] md:text-[14px] font-medium text-neutral-500 mt-1">
              points available
            </p>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#faf0eb] border border-neutral-100 flex items-center justify-center shrink-0">
            <div className="relative w-6 h-6 md:w-7 md:h-7">
              <Image src="/images/assets/reward.png" alt="" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#fdfcfb] border border-[#f8f1eb] rounded-[12px] p-4 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] w-full">
        <h2 className="font-sans text-[12px] font-bold text-black uppercase tracking-wider mb-1">
          All transactions
        </h2>
        <p className="font-sans text-[11px] md:text-[13px] font-medium text-neutral-500 mb-2">
          Sorted by most recent
        </p>

        <div className="flex flex-col">
          {displayedItems.map((item) => (
            <HistoryRow key={item.id} item={item} />
          ))}

          {isLoadingMore && (
            <>
              <HistoryRowSkeleton />
              <HistoryRowSkeleton />
            </>
          )}
        </div>

        {hasMoreToLoad && <div ref={loadMoreRef} className="h-1" aria-hidden />}
      </div>
    </section>
  );
}
