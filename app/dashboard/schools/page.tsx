"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGetSchoolRankingQuery } from '@/features/api/apiSlice';
import type { SchoolRankingEntry } from '@/lib/api/schools.types';

const PAGE_SIZE = 25;
const FALLBACK_AVATAR = '/images/school-building.png';

const GRID_ROW =
    'grid grid-cols-[60px_1fr_100px_100px_100px_80px] md:grid-cols-[100px_1fr_150px_150px_150px_120px] gap-4 items-center';

const formatNumber = (value: number | null | undefined) =>
    typeof value === 'number' ? value.toLocaleString('en-US') : '—';

const formatPrize = (value: number | null | undefined) =>
    typeof value === 'number'
        ? `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
        : '—';

function RankingRowSkeleton() {
    return (
        <div className={`${GRID_ROW} py-4 border-b border-neutral-200/30 animate-pulse`}>
            <div className="h-7 md:h-11 w-7 md:w-11 bg-neutral-200/60 rounded-full ml-1" />
            <div className="flex items-center gap-3">
                <div className="w-7.5 h-7.5 rounded-full bg-neutral-200/60 shrink-0" />
                <div className="h-4 w-32 bg-neutral-200/50 rounded" />
            </div>
            <div className="h-4 w-10 bg-neutral-200/40 rounded" />
            <div className="h-4 w-10 bg-neutral-200/40 rounded" />
            <div className="h-4 w-10 bg-neutral-200/40 rounded" />
            <div className="h-4 w-10 bg-neutral-200/40 rounded" />
        </div>
    );
}

function StatSkeleton() {
    return <div className="h-6 md:h-7 w-20 bg-neutral-200/60 rounded animate-pulse mt-2" />;
}

const MEDALS: Record<number, { base: string; mid: string; top: string }> = {
    1: { base: '#caa138', mid: '#dfb33e', top: '#e5c158' },
    2: { base: '#8d8d8d', mid: '#a8a8a8', top: '#c0c0c0' },
    3: { base: '#935b30', mid: '#af6f3b', top: '#cd7f32' },
};

function RankBadge({ rank }: { rank: number }) {
    const medal = MEDALS[rank];

    if (medal) {
        return (
            <svg className="w-7 h-7 md:w-11 md:h-11 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 13.5V21L12 19.5L15 21V13.5" fill={medal.base} opacity="0.85" />
                <path d="M12 13.5V21L15 19.5L18 21V13.5" fill={medal.mid} opacity="0.85" />
                <circle cx="12" cy="10" r="7" fill={medal.top} stroke={medal.base} strokeWidth="1.2" />
                <circle cx="12" cy="10" r="5.2" fill={medal.mid} />
                <text x="12" y="13" fontFamily="var(--font-sans), sans-serif" fontSize="9" fontWeight="950" fill="white" textAnchor="middle">
                    {rank}
                </text>
            </svg>
        );
    }

    return (
        <span className="font-sfpro text-[14px] md:text-[20px] font-bold text-neutral-500 pl-2">
            {rank}
        </span>
    );
}

function SchoolAvatar({ src, name }: { src: string | null; name: string }) {
    const [hasFailed, setHasFailed] = useState(false);
    const resolvedSrc = !src || hasFailed ? FALLBACK_AVATAR : src;

    return (
        <div className="relative w-7.5 h-7.5 rounded-full overflow-hidden border border-neutral-200/70 shadow-sm bg-neutral-100 flex items-center justify-center shrink-0">
            {/* Plain <img> on purpose: school logos are arbitrary remote URLs from
                the database, and next/image would require whitelisting every
                possible host in next.config.ts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={resolvedSrc}
                alt={`${name} avatar`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setHasFailed(true)}
            />
        </div>
    );
}

function RankingRow({ item }: { item: SchoolRankingEntry }) {
    return (
        <div className={`${GRID_ROW} py-4 border-b border-neutral-200/30 last:border-0 hover:bg-neutral-50/40 transition-colors duration-150`}>
            <div className="flex items-center pl-1">
                <RankBadge rank={item.rank} />
            </div>

            <div className="flex items-center gap-3 min-w-0">
                <SchoolAvatar src={item.imageUrl} name={item.schoolName} />
                <span
                    className="font-lato text-[12px] md:text-[18px] font-medium text-[#000000] truncate"
                    title={item.schoolName}
                >
                    {item.schoolName}
                </span>
            </div>

            <span className="font-lato text-[12px] md:text-[18px] font-medium text-[#000000]">
                {formatNumber(item.participants)}
            </span>
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-[#000000]">
                {formatNumber(item.prompts)}
            </span>
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-[#000000]">
                {formatNumber(item.invites)}
            </span>
            <span className="font-lato text-[12px] md:text-[18px] font-medium text-[#000000]">
                {formatNumber(item.total)}
            </span>
        </div>
    );
}

export default function SchoolsPage() {
    const [page, setPage] = useState(1);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { data, isFetching, isError, error, refetch } = useGetSchoolRankingQuery({
        page,
        limit: PAGE_SIZE,
    });

    // apiSlice merges every fetched page into one cache entry, so this is
    // already the full accumulated board.
    const rows = useMemo<SchoolRankingEntry[]>(() => data?.items ?? [], [data]);
    const meta = data?.meta;
    const hasMoreToLoad = Boolean(data?.pagination.hasNextPage);
    const isInitialLoad = isFetching && rows.length === 0;

    const loadMore = useCallback(() => {
        if (isFetching || !hasMoreToLoad) return;
        setPage((prev) => prev + 1);
    }, [isFetching, hasMoreToLoad]);

    useEffect(() => {
        if (!hasMoreToLoad) return;

        const sentinel = loadMoreRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '120px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMoreToLoad, loadMore]);

    const errorMessage = useMemo(() => {
        if (!isError) return null;
        const message = (error as { message?: string } | undefined)?.message;
        return message || 'We could not load the school ranking right now.';
    }, [isError, error]);

    return (
        <main className="flex-1 flex flex-col gap-6 md:gap-8">
            <title>School Ranking - Ambassador Dashboard</title>
            <meta name="description" content="View active campuses, see where your school stands nationally, and get insights on your campus reach." />

            {/* HEADER */}
            <div className="space-y-1">
                <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-[0.03em] text-neutral-900 leading-tight">
                    School Ranking
                </h1>
                <p className="text-[12px] md:text-[18px] font-lato font-medium tracking-[0.03em] text-neutral-500">
                    See who&apos;s leading the waitlist experience.
                </p>
            </div>

            {/* SUMMARY COMPETITION CARD */}
            <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col sm:flex-row items-center gap-6 sm:gap-12 w-full">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-[#efebe5] flex items-center justify-center shrink-0">
                        <svg className="w-5.5 h-5.5 text-[#584939]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M2.25 21h19.5" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <span className="font-lato text-[12px] md:text-[18px] font-bold text-neutral-800 block leading-none">
                            About this competition
                        </span>
                        <span className="font-lato text-[12px] md:text-[18px] font-normal text-neutral-500 mt-1.5 block leading-none">
                            {meta?.competition?.title || meta?.scopeLabel || 'Campus Competition'}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-wrap items-center justify-between sm:justify-end gap-8 sm:gap-16 w-full">
                    <div className="flex flex-col">
                        <span className="font-lato text-[12px] md:text-[18px] font-normal text-neutral-500 leading-none">
                            Total Schools
                        </span>
                        {meta ? (
                            <span className="font-lato text-[16px] md:text-[24px] font-bold text-neutral-800 mt-2 leading-none">
                                {formatNumber(meta.totalSchools)}
                            </span>
                        ) : (
                            <StatSkeleton />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-lato text-[12px] md:text-[18px] font-normal text-neutral-500 leading-none">
                            Total Participants
                        </span>
                        {meta ? (
                            <span className="font-lato text-[16px] md:text-[24px] font-bold text-neutral-800 mt-2 leading-none">
                                {formatNumber(meta.totalParticipants)}
                            </span>
                        ) : (
                            <StatSkeleton />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-lato text-[12px] md:text-[18px] font-normal text-neutral-500 leading-none">
                            Top Prize
                        </span>
                        {meta ? (
                            <span className="font-lato text-[16px] md:text-[24px] font-bold text-neutral-800 mt-2 leading-none">
                                {formatPrize(meta.topPrize)}
                            </span>
                        ) : (
                            <StatSkeleton />
                        )}
                    </div>
                </div>
            </section>

            {/* RANKING TABLE CARD */}
            <section className="bg-[#fbfbf9] border border-neutral-200/40 rounded-[12px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] w-full">
                <div className="overflow-x-auto no-scrollbar w-full">
                    <div className="min-w-[640px] md:min-w-[800px] flex flex-col gap-0.5">
                        <div className={`${GRID_ROW} pb-3 border-b border-neutral-200/60 font-sfpro text-[11px] md:text-[14px] font-bold text-[#402b23] uppercase tracking-widest`}>
                            <span>Rank</span>
                            <span>School</span>
                            <span>Participants</span>
                            <span>Prompts</span>
                            <span>Invites</span>
                            <span>Total</span>
                        </div>

                        {rows.map((item) => (
                            <RankingRow key={item.schoolId} item={item} />
                        ))}

                        {isFetching && (
                            <>
                                <RankingRowSkeleton />
                                <RankingRowSkeleton />
                                {isInitialLoad && (
                                    <>
                                        <RankingRowSkeleton />
                                        <RankingRowSkeleton />
                                        <RankingRowSkeleton />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {!isFetching && rows.length === 0 && !isError && (
                    <p className="py-10 text-center font-lato text-[13px] md:text-[16px] text-neutral-500">
                        No schools have scored yet. Rankings appear once participants start
                        sending prompts and invites.
                    </p>
                )}

                {isError && rows.length === 0 && (
                    <div className="py-10 flex flex-col items-center gap-3">
                        <p className="font-lato text-[13px] md:text-[16px] text-neutral-500 text-center">
                            {errorMessage}
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="font-lato text-[13px] md:text-[15px] font-bold text-[#402b23] underline underline-offset-4 hover:opacity-70 transition-opacity"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {hasMoreToLoad && <div ref={loadMoreRef} className="h-1" aria-hidden />}
            </section>
        </main>
    );
}
