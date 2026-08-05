"use client";

import React, { useCallback, useMemo, useState } from 'react';
import CommentsSidebar, {
  type CommentsSidebarTarget,
} from '@/app/components/dashboard/CommentsSidebar';
import { CreateForumPostSidebar } from '@/app/components/dashboard/CreateForumPostSidebar';
import {
  useListForumPostsQuery,
  useLikeForumPostMutation,
} from '@/features/api/apiSlice';
import type { ForumPost, ForumScope } from '@/lib/api/forum.types';

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ForumPostSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 px-3 animate-pulse">
      <div className="flex items-center gap-4 w-full">
        <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-1/3" />
          <div className="h-3 bg-neutral-200 rounded w-2/3" />
          <div className="h-2 bg-neutral-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeScopeTab, setActiveScopeTab] = useState<'campus' | 'market' | 'national'>('campus');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [commentsPost, setCommentsPost] = useState<ForumPost | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState<Record<string, { count: number; active: boolean }>>({});

  const [likePost] = useLikeForumPostMutation();

  const scopeParam: ForumScope = useMemo(() => {
    if (activeScopeTab === 'campus') return 'CAMPUS';
    if (activeScopeTab === 'market') return 'MARKET';
    return 'NATIONAL';
  }, [activeScopeTab]);

  const { data: postsResponse, isLoading, isFetching } = useListForumPostsQuery({
    scope: scopeParam,
    search: searchQuery.trim() || undefined,
    sortBy,
    limit: 50,
  });

  const pinnedPosts = useMemo(() => (postsResponse?.data ?? []).filter((p) => p.isPinned), [postsResponse?.data]);
  const recentPosts = useMemo(() => (postsResponse?.data ?? []).filter((p) => !p.isPinned), [postsResponse?.data]);

  const handleCloseComments = useCallback(() => {
    setCommentsPost(null);
  }, []);

  const commentsSidebarTarget = useMemo((): CommentsSidebarTarget | null => {
    if (!commentsPost) return null;
    const displayName = commentsPost.user?.fullName ?? commentsPost.user?.role ?? 'Anonymous';
    return {
      id: commentsPost.id,
      variant: 'post',
      commentsCount: commentsPost.commentsCount,
      likeCount: localLikes[commentsPost.id]?.count ?? commentsPost.likesCount,
      title: commentsPost.title,
      body: commentsPost.body,
      author: displayName,
      time: formatDate(commentsPost.createdAt),
      avatar: '',
      comments: [],
    };
  }, [commentsPost, localLikes]);

  const handleLike = useCallback(async (id: string, initialLikes: number, initialLiked: boolean) => {
    const isLiked = localLikes[id] ? localLikes[id].active : initialLiked;
    const currentCount = localLikes[id] ? localLikes[id].count : initialLikes;

    setLocalLikes((prev) => ({
      ...prev,
      [id]: {
        count: isLiked ? currentCount - 1 : currentCount + 1,
        active: !isLiked,
      },
    }));

    try {
      await likePost(id).unwrap();
    } catch {
      setLocalLikes((prev) => ({
        ...prev,
        [id]: {
          count: currentCount,
          active: isLiked,
        },
      }));
    }
  }, [likePost, localLikes]);

  const currentCommunityName = useMemo(() => {
    if (activeScopeTab === 'campus') {
      return 'Campus Forum';
    }
    if (activeScopeTab === 'market') {
      return 'Market Forum';
    }
    return 'National Forum';
  }, [activeScopeTab]);

  const showSkeleton = isLoading || isFetching;

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <title>Forum - Ambassador Dashboard</title>
        <meta name="description" content="Connect, discuss, and brainstorm with other student ambassadors in the exclusive Bea Ambassador Forum." />

        {/* HEADER */}
        <div className="space-y-1.5">
          <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-tight text-neutral-900 leading-tight">
            Forum
          </h1>
          <p className="text-[12px] md:text-[18px] font-sfpro font-medium text-neutral-500">
            Get to know the community.
          </p>
        </div>

        {/* TABS SELECTOR & START POST BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mt-2">
          {/* Segmented Tab Control */}
          <div className="flex items-center gap-2 w-full sm:max-w-md md:max-w-lg">
            {(['campus', 'market', 'national'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveScopeTab(tab)}
                className={`flex-1 text-center font-lato font-black text-[9px] md:text-[12px] uppercase tracking-wider py-2.5 rounded-[4px] transition-all duration-200 cursor-pointer shadow-sm ${
                  activeScopeTab === tab
                    ? 'bg-[#584939] text-white border border-[#584939]'
                    : 'bg-white text-neutral-500 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* + Start post Button */}
          <button
            onClick={() => setCreatePostOpen(true)}
            className="bg-black hover:bg-neutral-900 text-white font-lato text-[9px] md:text-[12px] font-bold py-2.5 px-14 rounded-[4px] flex items-center justify-center gap-1.5 shrink-0 select-none cursor-pointer transition-colors shadow-sm"
          >
            <span className="text-[12px] md:text-[16px] font-black -mt-0.5">+</span> Start post
          </button>
        </div>

        {/* CURRENT COMMUNITY IDENTIFIER CARD */}
        <div className="relative w-full max-w-[260px] md:max-w-[400px] mt-2">
          <div className="bg-[#fcfbf8] border border-neutral-200/60 rounded-[8px] px-5 py-3 w-full flex flex-col justify-center text-left shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <span className="font-sfpro font-bold text-[12px] md:text-[18px] uppercase tracking-widest text-[#908343] truncate">
              {currentCommunityName}
            </span>
            <span className="font-sfpro text-[9px] md:text-[12px] font-semibold text-neutral-400 mt-1">
              Ambassador space
            </span>
          </div>
        </div>

        {/* MAIN FORUM CONTAINER CARD */}
        <div className="bg-[#fcfbf8] border border-neutral-200/40 rounded-[12px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex flex-col gap-6 w-full">
          {/* SEARCH AND SORT ROW */}
          <div className="flex items-center gap-4 w-full justify-between">
            {/* Search Field */}
            <div className="relative flex-1 max-w-xl">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search posts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fcfbf8] border border-neutral-200/80 rounded-[4px] pl-10 pr-4 py-2.5 font-lato font-semibold text-[16px] md:text-[14px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
                className="appearance-none bg-[#fcfbf8] border border-neutral-200/80 rounded-[4px] pl-4 pr-9 py-2.5 font-lato font-bold text-[16px] md:text-[14px] text-neutral-700 focus:outline-none focus:border-neutral-400 transition-all cursor-pointer shadow-sm"
              >
                <option value="recent">Latest</option>
                <option value="popular">Popular</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* PINNED SECTION (Only show if there are pinned posts) */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 pl-1">
                <svg className="w-3 h-3 text-[#86795f] fill-current" viewBox="0 0 24 24">
                  <path d="M16 12V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v8l-2 2v2h5.2v6l.8.8.8-.8v-6H18v-2l-2-2z" />
                </svg>
                <span className="font-sfpro text-[11px] md:text-[14px] font-bold tracking-[0.12em] text-[#86795f] uppercase">
                  Pinned
                </span>
              </div>

              <div className="rounded-[10px] border border-neutral-300/40 p-2.5 divide-y divide-neutral-300/70 bg-white">
                {pinnedPosts.map((post) => {
                  const authorName = post.user?.fullName ?? 'Anonymous';
                  return (
                    <div
                      key={post.id}
                      onClick={() => setCommentsPost(post)}
                      className="flex items-center justify-between py-3.5 px-3 hover:bg-[#efebe5]/10 transition-all duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#efebe5] flex items-center justify-center shrink-0 border border-neutral-200/30 font-bold text-[12px] text-[#665746]">
                          {authorName[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <h4 className="text-[12px] md:text-[18px] font-bold text-neutral-800 font-lato leading-tight">
                            {post.title}
                          </h4>
                          <p className="text-[11px] md:text-[14px] font-lato font-medium text-neutral-500 mt-1.5 leading-none">
                            {post.body.slice(0, 100)}{post.body.length > 100 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RECENT POSTS SECTION */}
          <div className="space-y-4 pt-1">
            <span className="font-sfpro text-[11px] md:text-[14px] font-bold tracking-[0.12em] text-neutral-500 uppercase pl-1 block">
              Recent Posts
            </span>

            <div className="rounded-[10px] border border-neutral-300/40 p-2.5 divide-y divide-neutral-300/70 bg-white">
              {showSkeleton ? (
                <>
                  <ForumPostSkeleton />
                  <ForumPostSkeleton />
                  <ForumPostSkeleton />
                </>
              ) : recentPosts.length > 0 ? (
                recentPosts.map((post) => {
                  const authorName = post.user?.fullName ?? 'Anonymous';
                  const isLiked = localLikes[post.id]
                    ? localLikes[post.id].active
                    : post.isLiked ?? false;
                  const likeCount = localLikes[post.id]
                    ? localLikes[post.id].count
                    : post.likesCount;

                  return (
                    <div
                      key={post.id}
                      className="flex items-center justify-between py-4 px-3 hover:bg-[#efebe5]/10 transition-all duration-150"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Avatar Letter */}
                        <div className="w-8 h-8 rounded-full bg-[#efebe5] flex items-center justify-center border border-neutral-200/40 text-[#665746] font-bold text-[13px] shrink-0">
                          {authorName[0]?.toUpperCase() ?? '?'}
                        </div>

                        {/* Post Text */}
                        <div className="min-w-0">
                          <h4 className="text-[12px] md:text-[18px] font-lato font-bold text-neutral-900 leading-tight truncate">
                            {post.title}
                          </h4>
                          <p className="text-[11px] md:text-[14px] font-lato font-medium text-neutral-500 mt-1 leading-normal break-words">
                            {post.body}
                          </p>
                          <p className="text-[10px] md:text-[12px] font-lato font-semibold text-neutral-400 mt-2.5 leading-none">
                            {authorName} &bull; <span className="opacity-90">{formatDate(post.createdAt)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-5 pr-2 shrink-0">
                        {/* Comment Icon Button */}
                        <button
                          type="button"
                          onClick={() => setCommentsPost(post)}
                          className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer select-none"
                        >
                          {post.commentsCount > 0 && (
                            <span className="font-lato text-[12px] md:text-[18px] font-bold text-neutral-600 mt-0.5">
                              {post.commentsCount}
                            </span>
                          )}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.637 10.902 10.902 0 002.93-.983c.615-.17 1.247.1 1.755.378a8.889 8.889 0 004.376.983z" />
                          </svg>
                        </button>

                        {/* Like Icon Button */}
                        <button
                          onClick={() => void handleLike(post.id, post.likesCount, post.isLiked ?? false)}
                          className="flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
                        >
                          {likeCount > 0 && (
                            <span className={`font-lato text-[12px] md:text-[18px] font-bold mt-0.5 ${isLiked ? 'text-[#752a31]' : 'text-neutral-600'}`}>
                              {likeCount}
                            </span>
                          )}
                          <svg
                            className={`w-4 h-4 transition-colors ${isLiked ? 'fill-[#752a31] stroke-[#752a31]' : 'fill-none stroke-neutral-400'}`}
                            strokeWidth={2.2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[13px] md:text-[20px] text-neutral-400 font-semibold font-lato">
                  No posts yet in this forum. Be the first to start a conversation!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar for Comments */}
      <CommentsSidebar target={commentsSidebarTarget} onClose={handleCloseComments} />

      {/* Sidebar for Creating Post */}
      <CreateForumPostSidebar
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        defaultScope={scopeParam}
      />
    </>
  );
}
