"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ALL_ACTIVITIES_PATH = "/dashboard/today/all-activities";
const TOTAL_ACTIVITIES = 48;

const SCROLL_CONFIG = {
  dashboard: { initial: 4, loadMore: 0 },
  all: { initial: 10, loadMore: 8 },
} as const;

type RecentActivityVariant = "dashboard" | "all";

interface ActivityItem {
  id: string;
  school: string;
  message: string;
  timeAgo: string;
  avatarSrc: string;
}

interface RecentActivitySectionProps {
  variant: RecentActivityVariant;
}

function ActivityRowSkeleton() {
  return (
    <div className="flex items-start gap-3.5 animate-pulse">
      <div className="w-7 h-7 rounded-full bg-neutral-300/50 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-24 bg-neutral-300/50 rounded" />
        <div className="h-3.5 w-40 bg-neutral-300/40 rounded" />
        <div className="h-3 w-16 bg-neutral-300/30 rounded" />
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div className="flex items-start gap-3.5 group">
      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-neutral-200/70 shadow-sm bg-neutral-100 shrink-0">
        <Image
          src={item.avatarSrc}
          alt={`${item.school} activity`}
          fill
          sizes="28px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="font-lato text-[11px] md:text-[14px] font-bold text-neutral-900 leading-none">
          {item.school}
        </p>
        <p className="font-lato text-[11px] md:text-[14px] text-neutral-700 leading-none mt-1">
          {item.message}
        </p>
        <p className="font-lato text-[9px] md:text-[12px] font-semibold text-neutral-400 mt-1.5 leading-none">
          {item.timeAgo}
        </p>
      </div>
    </div>
  );
}

export default function RecentActivitySection({ variant }: RecentActivitySectionProps) {
  const isDashboard = variant === "dashboard";
  const { initial: initialCount, loadMore: loadMoreCount } = SCROLL_CONFIG[variant];

  const [visibleCount, setVisibleCount] = useState<number>(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const activities = useMemo(
    () =>
      Array.from({ length: TOTAL_ACTIVITIES }, (_, i) => ({
        id: `activity-${i + 1}`,
        school: ["Northeastern", "Boston University", "Harvard", "Boston College", "MIT"][i % 5],
        message: [
          "Took the lead in Boston",
          "Joined the waitlist",
          "Submitted a daily prompt",
          "Invited 3 friends",
          "Moved up the leaderboard",
        ][i % 5],
        timeAgo: `${(i + 1) * 2} min ago`,
        avatarSrc: [
          "/images/ron-avatar.png",
          "/images/assets/campus.png",
          "/images/assets/market.png",
          "/images/assets/national.png",
          "/images/hero-students.png",
        ][i % 5],
      })),
    []
  );

  const displayedActivities = useMemo(
    () => activities.slice(0, visibleCount),
    [activities, visibleCount]
  );

  const hasMoreToLoad = !isDashboard && visibleCount < activities.length;

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (!hasMoreToLoad || loadMoreCount === 0) return;

    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isLoadingMore) return;

        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + loadMoreCount, activities.length));
          setIsLoadingMore(false);
        }, 600);
      },
      { rootMargin: "120px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreToLoad, isLoadingMore, activities.length, loadMoreCount]);

  const content = (
    <>
      <span className="text-[11px] md:text-[14px] font-sfpro font-bold tracking-[0.15em] text-[#493932] uppercase">
        Recent Activity
      </span>

      <div className="space-y-4">
        {displayedActivities.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}

        {isLoadingMore && (
          <>
            <ActivityRowSkeleton />
            <ActivityRowSkeleton />
          </>
        )}
      </div>

      {hasMoreToLoad && <div ref={loadMoreRef} className="h-1" aria-hidden />}

      {isDashboard && (
        <div className="border-t border-neutral-200/60 pt-4 mt-2">
          <Link
            href={ALL_ACTIVITIES_PATH}
            className="block w-full font-minion text-[11px] md:text-[14px] font-bold text-neutral-700 hover:text-black text-center transition-all cursor-pointer"
          >
            See all activity
          </Link>
        </div>
      )}
    </>
  );

  if (isDashboard) {
    return (
      <div className="bg-[#f6f4f1] rounded-[12px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-neutral-200/40 flex flex-col gap-5">
        {content}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-neutral-200 bg-[#faf9f6] text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all shrink-0"
          aria-label="Back to dashboard"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-tight text-neutral-900 leading-tight">
            All Activity
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            Everything happening in your community
          </p>
        </div>
      </div>

      <div className="bg-[#f6f4f1] rounded-[12px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-neutral-200/40 flex flex-col gap-5">
        {content}
      </div>
    </section>
  );
}
