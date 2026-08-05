"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetPromptsArchiveQuery, useGetPromptResponsesQuery } from '@/features/api/apiSlice';
import type { ArchivePrompt, PromptResponse, ResponseScope } from '@/lib/api/prompts.types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function PromptResponseCard({ response }: { response: PromptResponse }) {
  const displayName = response.user?.fullName ?? response.user?.email?.split('@')[0] ?? 'Anonymous';
  const schoolName = response.user?.school?.name ?? response.user?.market?.name ?? '';
  return (
    <div className="bg-white border border-neutral-200/50 rounded-[10px] p-4 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-[#e8e0db] flex items-center justify-center text-[#584939] font-bold text-[11px] shrink-0 mt-0.5">
          {displayName[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-lato text-[12px] font-bold text-neutral-800">
            {displayName}
            {schoolName && <span className="font-medium text-neutral-400">, {schoolName}</span>}
          </p>
          <p className="font-lato text-[13px] text-neutral-600 leading-relaxed mt-1">
            &ldquo;{response.content}&rdquo;
          </p>
        </div>
        <span className="font-lato text-[10px] font-semibold text-[#752a31] bg-[#f6f6f6] border border-neutral-200/30 rounded-[4px] px-2 py-1 shrink-0">
          ♥ {response.likesCount}
        </span>
      </div>
    </div>
  );
}

function ArchivePromptCard({ prompt }: { prompt: ArchivePrompt }) {
  const [expanded, setExpanded] = useState(false);
  const [scope, setScope] = useState<ResponseScope>('national');

  const { data, isLoading } = useGetPromptResponsesQuery(
    { promptId: prompt.id, scope, limit: 5 },
    { skip: !expanded }
  );

  return (
    <div className="bg-[#fbf9f7] border border-neutral-200/50 rounded-[12px] overflow-hidden">
      {/* Prompt header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#f7f4f1] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-sfpro text-[10px] font-bold tracking-[0.15em] text-[#9f947e] uppercase mb-1">
            {formatDate(prompt.promptDate)}
          </p>
          <h3 className="font-canela text-[16px] md:text-[20px] text-neutral-900 leading-snug">
            {prompt.title}
          </h3>
          {prompt.description && (
            <p className="font-lato text-[12px] font-medium text-neutral-500 mt-1 leading-relaxed">
              {prompt.description}
            </p>
          )}
        </div>
        <div className={`w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 transition-transform duration-200 mt-0.5 ${expanded ? 'rotate-180' : ''}`}>
          <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {/* Expanded responses */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-neutral-200/50">
          {/* Scope tabs */}
          <div className="flex items-center gap-2 my-4 max-w-sm">
            {(['campus', 'market', 'national'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setScope(tab)}
                className={`flex-1 text-center font-lato font-black text-[9px] uppercase tracking-wider py-2 rounded-[4px] transition-all cursor-pointer ${
                  scope === tab
                    ? 'bg-[#584939] text-white'
                    : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {tab === 'campus' ? 'Campus' : tab === 'market' ? 'Market' : 'National'}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-neutral-200/40 rounded-[8px] animate-pulse" />
              ))}
            </div>
          ) : !data?.items.length ? (
            <p className="font-lato text-[13px] font-medium text-neutral-400 text-center py-4">
              No responses for this scope yet.
            </p>
          ) : (
            <div className="space-y-3">
              {data.items.map((r) => (
                <PromptResponseCard key={r.id} response={r} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ArchiveSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#fbf9f7] border border-neutral-200/50 rounded-[12px] p-5 animate-pulse">
          <div className="h-3 w-24 bg-neutral-300/40 rounded mb-2" />
          <div className="h-6 w-3/4 bg-neutral-300/50 rounded" />
          <div className="h-4 w-1/2 bg-neutral-300/30 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function AllResponsesPage() {
  const { data, isLoading } = useGetPromptsArchiveQuery();
  const prompts = data?.items ?? [];

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8">
      <title>Past Prompts - Ambassador Dashboard</title>
      <meta name="description" content="Browse past prompts and top community responses from the Bea Ambassador Dashboard." />

      {/* Header */}
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
            Prompt Archive
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            Browse past prompts and top community responses
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <ArchiveSkeleton />
      ) : prompts.length === 0 ? (
        <div className="bg-white/40 rounded-[12px] p-12 text-center border border-dashed border-neutral-300/60">
          <p className="font-lato text-[14px] font-semibold text-neutral-500">No past prompts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <ArchivePromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </main>
  );
}
