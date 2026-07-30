/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  useGetTodayPromptQuery,
  useGetPromptResponsesQuery,
  useLikeResponseMutation,
  useGetWaitlistDashboardQuery,
} from '@/features/api/apiSlice';
import type { PromptResponse, ResponseScope } from '@/lib/api/prompts.types';
import { getCompetitionLifecycle } from '@/lib/competition-lifecycle';
import CommentsSidebar, {
  type CommentsSidebarTarget,
} from '@/app/components/dashboard/CommentsSidebar';

const ALL_RESPONSES_PATH = '/dashboard/today/all-responses';

const SCROLL_CONFIG = {
  dashboard: { initial: 3, loadMore: 3 },
  all: { initial: 8, loadMore: 5 },
} as const;

type TopResponsesVariant = 'dashboard' | 'all';

interface TopResponsesSectionProps {
  variant: TopResponsesVariant;
  promptId?: string;
}

function rankLabel(index: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const n = index + 1;
  const v = n % 100;
  return `#${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
}

function ResponseCardSkeleton() {
  return (
    <div className="bg-[#efebe5] rounded-[10px] p-6 border border-neutral-200/40 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-16 bg-neutral-300/50 rounded" />
          <div className="h-3 w-20 bg-neutral-300/40 rounded" />
        </div>
        <div className="h-8 w-24 bg-neutral-300/50 rounded-[6px]" />
      </div>
      <div className="h-5 w-full max-w-xs bg-neutral-300/40 rounded" />
      <div className="h-4 w-3/4 bg-neutral-300/30 rounded" />
      <div className="flex items-center gap-2 pt-2 border-t border-neutral-300/35">
        <div className="w-7 h-7 rounded-full bg-neutral-300/50" />
        <div className="h-3 w-36 bg-neutral-300/40 rounded" />
      </div>
    </div>
  );
}

function ResponseCard({
  item,
  index,
  localLikeState,
  onLike,
  onCommentsClick,
  scoringOpen,
}: {
  item: PromptResponse;
  index: number;
  localLikeState: { count: number; active: boolean };
  onLike: (id: string, currentCount: number, isLiked: boolean) => void;
  onCommentsClick: (item: PromptResponse) => void;
  scoringOpen: boolean;
}) {
  const isLiked = localLikeState.active;
  const displayName = item.user?.fullName ?? item.user?.email?.split('@')[0] ?? 'Anonymous';
  const schoolName = item.user?.school?.name ?? item.user?.market?.name ?? '';

  return (
    <div className="bg-[#efebe5] rounded-[10px] p-6 border border-neutral-200/40 flex flex-col gap-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[22px] md:text-[36px] font-sfpro font-normal text-neutral-900 leading-none tracking-[0.08em]">
            {rankLabel(index)}
          </h4>
          <span className="text-[11px] md:text-[14px] font-lato text-[#93908c] mt-1 uppercase tracking-wider block">
            {schoolName || 'Community'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onLike(item.id, localLikeState.count, isLiked)}
          disabled={!scoringOpen}
          aria-pressed={isLiked}
          aria-label={isLiked ? `Unlike, ${localLikeState.count} likes` : `Like, ${localLikeState.count} likes`}
          className={`px-3 py-1.5 rounded-[6px] font-lato text-[11px] md:text-[14px] font-bold flex items-center gap-1.5 transition-all shadow-sm border disabled:opacity-55 disabled:cursor-not-allowed ${isLiked
            ? 'bg-[#fde8e8] border-[#f5c4c4] text-[#c41e3a] hover:opacity-90'
            : 'bg-[#f6f6f6] border-neutral-200/30 text-[#752a31] hover:opacity-85'
            }`}
        >
          <span>{localLikeState.count} likes</span>
          <svg
            className={`w-3.5 h-3.5 transition-colors duration-200 ${isLiked ? 'stroke-[#dc2626] fill-[#dc2626]' : 'stroke-[#752a31] fill-none'
              }`}
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="flex gap-2.5 items-start pl-1">
        <span className="text-[40px] md:text-[60px] font-serif text-[#cbc2bf] leading-none select-none -mt-1 opacity-85">&ldquo;</span>
        <p className="text-[14px] md:text-[18px] font-lato font-medium text-neutral-700 leading-relaxed max-w-[320px]">
          {item.content ?? item.responseText ?? ''}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-300/35 pt-4 pl-1">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#e8e0db] flex items-center justify-center text-[#584939] font-bold text-[12px] border border-neutral-200 shadow-sm shrink-0">
            {displayName[0]?.toUpperCase() ?? '?'}
          </div>
          <p className="text-[12px] md:text-[16px] font-lato text-neutral-800">
            <span className="font-bold">{displayName}</span>
            {schoolName && <span className="text-neutral-400 font-medium">, {schoolName}</span>}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onCommentsClick(item)}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 text-[11px] md:text-[14px] font-semibold cursor-pointer"
        >
          <span>{item.commentsCount} comments</span>
          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.637 10.902 10.902 0 002.93-.983c.615-.17 1.247.1 1.755.378a8.889 8.889 0 004.376.983z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function TopResponsesSection({ variant, promptId: propPromptId }: TopResponsesSectionProps) {
  const isDashboard = variant === 'dashboard';
  const { initial: initialCount, loadMore: loadMoreCount } = SCROLL_CONFIG[variant];
  const { data: dashboard } = useGetWaitlistDashboardQuery();
  const lifecycle = getCompetitionLifecycle(dashboard?.competition);
  const scoringOpen = lifecycle.scoringOpen;

  const { data: todayPrompt } = useGetTodayPromptQuery(undefined, { skip: !!propPromptId });
  const promptId = propPromptId ?? todayPrompt?.id;

  const [scopeTab, setScopeTab] = useState<ResponseScope>('national');
  const [sortBy, setSortBy] = useState<'most-liked' | 'recent'>('most-liked');
  const [visibleCount, setVisibleCount] = useState<number>(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [localLikes, setLocalLikes] = useState<Record<string, { count: number; active: boolean }>>({});
  const [commentsTarget, setCommentsTarget] = useState<PromptResponse | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [likeResponse] = useLikeResponseMutation();

  const { data: responsesData, isLoading, isFetching } = useGetPromptResponsesQuery(
    { promptId: promptId!, scope: scopeTab, limit: 50 },
    { skip: !promptId }
  );

  const allItems = useMemo(() => responsesData?.items ?? [], [responsesData?.items]);

  const sortedItems = useMemo(() => {
    const list = [...allItems];
    list.sort((a, b) => {
      const aLikes = localLikes[a.id]?.count ?? a.likesCount;
      const bLikes = localLikes[b.id]?.count ?? b.likesCount;
      if (sortBy === 'most-liked') return bLikes - aLikes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [allItems, localLikes, sortBy]);

  const displayedItems = useMemo(() => sortedItems.slice(0, visibleCount), [sortedItems, visibleCount]);
  const hasMore = visibleCount < sortedItems.length;

  useEffect(() => { setVisibleCount(initialCount); }, [scopeTab, sortBy, initialCount]);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isLoadingMore) return;
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((v) => Math.min(v + loadMoreCount, sortedItems.length));
          setIsLoadingMore(false);
        }, 500);
      },
      { rootMargin: '120px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, sortedItems.length, loadMoreCount]);

  const handleLike = useCallback(async (id: string, currentCount: number, isLiked: boolean) => {
    if (!scoringOpen) return;
    setLocalLikes((prev) => ({
      ...prev,
      [id]: { count: isLiked ? currentCount - 1 : currentCount + 1, active: !isLiked },
    }));
    try {
      await likeResponse({ responseId: id }).unwrap();
    } catch {
      setLocalLikes((prev) => ({
        ...prev,
        [id]: { count: currentCount, active: isLiked },
      }));
    }
  }, [likeResponse, scoringOpen]);

  const handleCommentsClick = useCallback((item: PromptResponse) => {
    setCommentsTarget(item);
  }, []);

  const sidebarTarget = useMemo((): CommentsSidebarTarget | null => {
    if (!commentsTarget) return null;
    const displayName = commentsTarget.user?.fullName ?? commentsTarget.user?.email?.split('@')[0] ?? 'Anonymous';
    const schoolName = commentsTarget.user?.school?.name ?? commentsTarget.user?.market?.name ?? '';
    return {
      id: commentsTarget.id,
      variant: 'response',
      commentsCount: commentsTarget.commentsCount,
      likeCount: localLikes[commentsTarget.id]?.count ?? commentsTarget.likesCount,
      rank: rankLabel(sortedItems.findIndex((r) => r.id === commentsTarget.id)),
      subtitle: schoolName || 'Community',
      promptTitle: (commentsTarget.responseText ?? commentsTarget.content ?? '').slice(0, 60),
      text: commentsTarget.responseText ?? commentsTarget.content ?? '',
      userName: displayName,
      school: schoolName,
      avatarSrc: '',
      comments: [],
    };
  }, [commentsTarget, localLikes, sortedItems]);

  const showSkeleton = isLoading || isFetching;

  const seeAllLink = (
    <Link
      href={ALL_RESPONSES_PATH}
      className="text-[14px] md:text-[18px] font-bold text-neutral-800 hover:text-black flex items-center gap-1 group py-2 whitespace-nowrap cursor-pointer"
    >
      <span>See all responses</span>
      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </Link>
  );

  return (
    <>
      <section className="space-y-5">
        {/* Back header for 'all' variant */}
        {variant === 'all' && (
          <div className="flex items-center gap-3 pb-1">
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
                All Responses
              </h1>
              <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
                Browse every response from your community
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] md:text-[24px] font-sfpro font-bold uppercase tracking-[0.05em] text-neutral-500">
              Top Responses
            </h3>
            {isDashboard && seeAllLink}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'most-liked' | 'recent')}
                className="appearance-none bg-[#faf9f6] border border-neutral-200 rounded-[8px] pl-4 pr-9 py-2.5 font-lato text-[11px] md:text-[14px] font-bold text-neutral-700 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all cursor-pointer"
              >
                <option value="most-liked">Most liked</option>
                <option value="recent">Most recent</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Scope tabs */}
        <div className="flex items-center gap-2 w-full sm:max-w-md md:max-w-lg">
          {(['campus', 'market', 'national'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setScopeTab(tab)}
              className={`flex-1 text-center font-lato font-black text-[9px] md:text-[12px] uppercase tracking-wider py-2.5 rounded-[4px] transition-all duration-200 cursor-pointer shadow-sm ${scopeTab === tab
                ? 'bg-[#584939] text-white border border-[#584939]'
                : 'bg-white text-neutral-500 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-800'
                }`}
            >
              {tab === 'campus' ? 'Your Campus' : tab === 'market' ? 'Your Market' : 'National'}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 pt-2">
          {showSkeleton ? (
            <>
              <ResponseCardSkeleton />
              <ResponseCardSkeleton />
              {!isDashboard && <ResponseCardSkeleton />}
            </>
          ) : !promptId ? (
            <div className="bg-white/40 rounded-[12px] p-8 text-center border border-dashed border-neutral-300/60">
              <p className="text-[14px] font-lato font-semibold text-neutral-500">No active prompt today.</p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="bg-white/40 rounded-[12px] p-8 text-center border border-dashed border-neutral-300/60">
              <p className="text-[14px] font-lato font-semibold text-neutral-500">No responses yet. Be the first to respond!</p>
            </div>
          ) : (
            displayedItems.map((item, index) => {
              const likeState = localLikes[item.id] ?? { count: item.likesCount, active: item.isLiked ?? false };
              return (
                <ResponseCard
                  key={item.id}
                  item={item}
                  index={index}
                  localLikeState={likeState}
                  onLike={handleLike}
                  onCommentsClick={handleCommentsClick}
                  scoringOpen={scoringOpen}
                />
              );
            })
          )}

          {isLoadingMore && (
            <>
              <ResponseCardSkeleton />
              <ResponseCardSkeleton />
            </>
          )}
        </div>

        {hasMore && <div ref={loadMoreRef} className="h-1" aria-hidden />}

        {/* Bottom promo banner (dashboard only) */}
        {isDashboard && (
          <div className="bg-[#f9f5f2] rounded-[10px] p-5 border border-neutral-200/40 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#f6dedc] flex items-center justify-center text-[#df8b6b] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <h4 className="text-[16px] md:text-[20px] font-sfpro font-normal text-neutral-800 leading-tight tracking-[0.03em]">
                  Est 2 weeks until launch
                </h4>
                <p className="text-[12px] md:text-[14px] font-lato font-medium text-neutral-500 mt-1">
                  You&apos;ll be notified by email
                </p>
              </div>
            </div>
            <button className="bg-[#8a8886] hover:bg-[#727170] active:scale-[0.98] text-white font-lato text-[12px] md:text-[14px] font-bold px-6 py-2.5 rounded-[8px] select-none flex-shrink-0 shadow-sm transition-all cursor-pointer">
              Get the app
            </button>
          </div>
        )}
      </section>

      <CommentsSidebar
        target={sidebarTarget}
        onClose={() => setCommentsTarget(null)}
        commentsEnabled={scoringOpen}
      />
    </>
  );
}
