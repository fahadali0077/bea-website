"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Globe, GraduationCap } from "lucide-react";
import { WAITLIST_PRIZES_DETAIL } from "@/lib/waitlist-page-content";
import "@/styles/waitlist.css";

const ALL_STANDING_PATH = "/dashboard/rewards/standing";
const TOTAL_STANDING = 30;

const SCROLL_CONFIG = {
  dashboard: { initial: 3, loadMore: 0 },
  all: { initial: 6, loadMore: 6 },
} as const;

type StandingIcon = "campus" | "market" | "national";
type StandingVariant = "dashboard" | "all";

export interface StandingItem {
  id: string;
  title: string;
  desc: string;
  value: string;
  icon: StandingIcon;
}

interface StandingSectionProps {
  variant: StandingVariant;
}

const RANK_ICONS = {
  campus: GraduationCap,
  market: Building2,
  national: Globe,
} as const;

const EXTRA_STANDING_TITLES = [
  "Weekly prompt rank",
  "Invite streak rank",
  "School contribution rank",
  "Response quality score",
  "Community engagement rank",
  "Monthly ambassador rank",
];

const CARD_STYLE = {
  background: "#f4f0ec",
  borderColor: "#e3ded6",
  borderRadius: "12px",
} as const;

function buildAllStanding(): StandingItem[] {
  const baseRanks = WAITLIST_PRIZES_DETAIL.standing.ranks;

  return Array.from({ length: TOTAL_STANDING }, (_, i) => {
    const template = baseRanks[i % baseRanks.length];
    const title = i < baseRanks.length ? template.title : EXTRA_STANDING_TITLES[i % EXTRA_STANDING_TITLES.length];

    return {
      id: `standing-${i + 1}`,
      title,
      desc: template.desc,
      value: i < baseRanks.length ? template.value : `#${(i + 1) * 7}`,
      icon: template.icon,
    };
  });
}

function StandingRowSkeleton() {
  return (
    <li
      className="waitlist-earn-item animate-pulse"
      style={{ borderColor: "#e3ded6" }}
    >
      <div className="w-9 h-9 rounded-full bg-neutral-200/60 shrink-0" />
      <div className="waitlist-earn-text flex-1 space-y-2">
        <div className="h-4 w-32 bg-neutral-200/50 rounded" />
        <div className="h-3 w-full max-w-xs bg-neutral-200/40 rounded" />
      </div>
      <div className="h-5 w-10 bg-neutral-200/50 rounded shrink-0" />
    </li>
  );
}

function StandingRow({ item }: { item: StandingItem }) {
  const Icon = RANK_ICONS[item.icon];

  return (
    <li className="waitlist-earn-item" style={{ borderColor: "#e3ded6" }}>
      <span
        className="waitlist-info-icon"
        style={{ background: "#faf0eb", color: "#d05038" }}
        aria-hidden
      >
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <div className="waitlist-earn-text">
        <p className="waitlist-earn-title" style={{ color: "#1a1a1a" }}>
          {item.title}
        </p>
        <p className="waitlist-earn-desc" style={{ color: "#5a5550" }}>
          {item.desc}
        </p>
      </div>
      <span className="waitlist-standing-value" style={{ color: "#1a1a1a" }}>
        {item.value}
      </span>
    </li>
  );
}

export default function StandingSection({ variant }: StandingSectionProps) {
  const isDashboard = variant === "dashboard";
  const { initial: initialCount, loadMore: loadMoreCount } = SCROLL_CONFIG[variant];
  const { standing } = WAITLIST_PRIZES_DETAIL;

  const [visibleCount, setVisibleCount] = useState<number>(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allStanding = useMemo(() => buildAllStanding(), []);

  const displayedStanding = useMemo(
    () => allStanding.slice(0, visibleCount),
    [allStanding, visibleCount]
  );

  const hasMoreToLoad = !isDashboard && visibleCount < allStanding.length;

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
          setVisibleCount((prev) => Math.min(prev + loadMoreCount, allStanding.length));
          setIsLoadingMore(false);
        }, 600);
      },
      { rootMargin: "120px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreToLoad, isLoadingMore, allStanding.length, loadMoreCount]);

  const listCard = (
    <div
      className={`waitlist-info-card w-full${isDashboard ? "" : ""}`}
      style={{
        ...CARD_STYLE,
        marginTop: isDashboard ? "20px" : 0,
      }}
    >
      <h2 className="waitlist-card-heading" style={{ color: "#1a1a1a" }}>
        {standing.heading}
      </h2>
      <ul className="waitlist-earn-list w-full">
        {displayedStanding.map((item) => (
          <StandingRow key={item.id} item={item} />
        ))}

        {isLoadingMore && (
          <>
            <StandingRowSkeleton />
            <StandingRowSkeleton />
          </>
        )}
      </ul>

      {isDashboard && (
        <Link
          href={ALL_STANDING_PATH}
          className="waitlist-prizes-viewall waitlist-standing-cta"
          style={{ color: "#4a3429", fontWeight: 700 }}
        >
          {standing.cta}
          <ArrowRight size={15} strokeWidth={1.75} />
        </Link>
      )}

      {hasMoreToLoad && <div ref={loadMoreRef} className="h-1" aria-hidden />}
    </div>
  );

  if (isDashboard) {
    return listCard;
  }

  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/rewards"
          className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-neutral-200 bg-[#faf9f6] text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all shrink-0"
          aria-label="Back to rewards"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-tight text-neutral-900 leading-tight">
            Your Standing
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            Track your ranks across campus, market, and national
          </p>
        </div>
      </div>

      {listCard}
    </section>
  );
}
