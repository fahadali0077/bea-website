/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  useCommentOnResponseMutation,
  useGetResponseCommentsQuery,
  useGetForumPostQuery,
  useCommentForumPostMutation,
} from "@/features/api/apiSlice";
import type { PromptResponseComment } from "@/lib/api/prompts.types";
import type { ForumComment } from "@/lib/api/forum.types";

const CLOSE_DURATION_MS = 280;

export interface SidebarComment {
  id: string;
  userName: string;
  school: string;
  avatarSrc: string;
  text: string;
  timeAgo: string;
}

type ResponsePreviewData = {
  variant: "response";
  rank: string;
  subtitle: string;
  promptTitle: string;
  text: string;
  userName: string;
  school: string;
  avatarSrc: string;
};

type PostPreviewData = {
  variant: "post";
  title: string;
  body: string;
  author: string;
  time: string;
  avatar: string;
};

export type CommentsSidebarTarget = {
  id: string;
  commentsCount: number;
  likeCount: number;
  comments: SidebarComment[];
} & (ResponsePreviewData | PostPreviewData);

interface CommentsSidebarProps {
  target: CommentsSidebarTarget | null;
  onClose: () => void;
  commentsEnabled?: boolean;
}

function LikeBadge({ count }: { count: number }) {
  return (
    <div className="px-2.5 py-1 rounded-md font-lato text-[10px] md:text-[12px] font-bold flex items-center gap-1 shrink-0 bg-[#f6f6f6] border border-neutral-200/30 text-[#752a31]">
      <span>{count} likes</span>
      <svg
        className="w-3 h-3 stroke-[#752a31] fill-none"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </div>
  );
}

function ThreadPreview({
  target,
  likeCount,
}: {
  target: ResponsePreviewData | PostPreviewData;
  likeCount: number;
}) {
  if (target.variant === "post") {
    return (
      <div className="bg-[#efebe5] rounded-[10px] p-4 md:p-5 border border-neutral-200/40 flex flex-col gap-3.5 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-[14px] md:text-[20px] font-lato font-bold text-neutral-900 leading-tight min-w-0">
            {target.title}
          </h4>
          <LikeBadge count={likeCount} />
        </div>
        <p className="text-[11px] md:text-[13px] font-lato font-medium text-neutral-500 leading-relaxed">
          {target.body}
        </p>
        <div className="flex items-center gap-2.5 border-t border-neutral-300/35 pt-3">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 shrink-0">
            <Image
              src={target.avatar}
              alt={`${target.author} avatar`}
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          <p className="text-[11px] md:text-[14px] font-lato text-neutral-800 truncate">
            <span className="font-bold">{target.author}</span>
            <span className="text-neutral-400 font-medium"> &bull; {target.time}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#efebe5] rounded-[10px] p-4 md:p-5 border border-neutral-200/40 flex flex-col gap-3.5 shrink-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[18px] md:text-[28px] font-sfpro font-normal text-neutral-900 leading-none tracking-[0.08em]">
            {target.rank}
          </h4>
          <span className="text-[10px] md:text-[14px] font-minion text-[#93908c] mt-1 uppercase tracking-wider block">
            {target.subtitle}
          </span>
        </div>
        <LikeBadge count={likeCount} />
      </div>

      <div className="flex gap-2 items-start">
        <span className="text-[28px] md:text-[40px] font-serif text-[#cbc2bf] leading-none select-none -mt-0.5 opacity-85">
          &ldquo;
        </span>
        <div className="min-w-0 flex flex-col gap-1">
          <h5 className="text-[14px] md:text-[20px] font-canela font-bold text-neutral-600 leading-tight">
            {target.promptTitle}
          </h5>
          <p className="text-[11px] md:text-[13px] font-lato font-semibold text-neutral-500 leading-relaxed">
            {target.text}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 border-t border-neutral-300/35 pt-3">
        {target.avatarSrc ? (
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 shrink-0">
            <Image
              src={target.avatarSrc}
              alt={`${target.userName} avatar`}
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#e8e0db] flex items-center justify-center text-[#584939] font-bold text-[12px] border border-neutral-200 shadow-sm shrink-0">
            {target.userName[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <p className="text-[11px] md:text-[14px] font-lato text-neutral-800 truncate">
          <span className="font-bold">{target.userName}</span>
          <span className="text-neutral-400 font-medium">, {target.school}</span>
        </p>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: SidebarComment }) {
  return (
    <div className="bg-white rounded-[10px] p-4 border border-neutral-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="flex items-start gap-3">
        {comment.avatarSrc ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 shrink-0">
            <Image
              src={comment.avatarSrc}
              alt={`${comment.userName} avatar`}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#e8e0db] flex items-center justify-center text-[#584939] font-bold text-[12px] border border-neutral-200 shadow-sm shrink-0">
            {comment.userName[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[12px] md:text-[14px] font-lato text-neutral-800 truncate">
              <span className="font-bold">{comment.userName}</span>
              <span className="text-neutral-400 font-medium">, {comment.school}</span>
            </p>
            <span className="text-[10px] md:text-[11px] font-lato font-semibold text-neutral-400 shrink-0">
              {comment.timeAgo}
            </span>
          </div>
          <p className="text-[11px] md:text-[13px] font-lato font-medium text-neutral-600 leading-relaxed mt-1.5">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CommentsSidebar({ target, onClose, commentsEnabled = true }: CommentsSidebarProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [displayTarget, setDisplayTarget] = useState<CommentsSidebarTarget | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);

  const [commentOnResponse] = useCommentOnResponseMutation();
  const [commentOnForumPost] = useCommentForumPostMutation();

  const isResponse = displayTarget?.variant === "response";
  const isPost = displayTarget?.variant === "post";

  const { data: responseCommentsData, isLoading: responseLoading, isFetching: responseFetching } = useGetResponseCommentsQuery(
    { responseId: displayTarget?.id ?? "" },
    { skip: !displayTarget?.id || !isResponse }
  );

  const { data: forumPostData, isLoading: postLoading, isFetching: postFetching } = useGetForumPostQuery(
    displayTarget?.id ?? "",
    { skip: !displayTarget?.id || !isPost }
  );

  const comments: SidebarComment[] = useMemo(() => {
    if (!displayTarget) return [];
    if (displayTarget.variant === "response") {
      return (
        responseCommentsData?.items.map((comment: PromptResponseComment) => ({
          id: comment.id,
          userName: comment.user?.fullName ?? "Anonymous",
          school: "",
          avatarSrc: "",
          text: comment.commentText,
          timeAgo: new Date(comment.createdAt).toLocaleString(),
        })) ?? []
      );
    } else {
      return (
        forumPostData?.comments?.map((comment: ForumComment) => ({
          id: comment.id,
          userName: comment.user?.fullName ?? "Anonymous",
          school: "",
          avatarSrc: "",
          text: comment.commentText,
          timeAgo: new Date(comment.createdAt).toLocaleString(),
        })) ?? []
      );
    }
  }, [displayTarget, responseCommentsData?.items, forumPostData?.comments]);

  // Only the first load replaces the list. isFetching is also true for the
  // background refetch that follows posting a comment, and including it here
  // tore the whole list down and showed "Loading comments..." even though the
  // cached comments were still in memory.
  const commentsAreLoading = isResponse ? responseLoading : postLoading;

  // Used for a quiet inline indicator instead — the list stays on screen.
  const commentsAreRefreshing = isResponse ? responseFetching : postFetching;

  // displayTarget.commentsCount is captured when the sidebar opens, so it went
  // stale the moment a comment was added. Count the live list instead.
  const liveCommentCount = commentsAreLoading ? displayTarget?.commentsCount ?? 0 : comments.length;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (isClosingRef.current || !isRendered) return;
    isClosingRef.current = true;
    setIsPanelOpen(false);

    closeTimerRef.current = setTimeout(() => {
      setIsRendered(false);
      setDisplayTarget(null);
      isClosingRef.current = false;
      onClose();
    }, CLOSE_DURATION_MS);
  }, [isRendered, onClose]);

  useEffect(() => {
    if (target) {
      clearCloseTimer();
      isClosingRef.current = false;
      setDisplayTarget(target);
      setCommentText("");
      setIsRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsPanelOpen(true));
      });
    }
  }, [target, clearCloseTimer]);

  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRendered, handleClose]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const handleSubmit = useCallback(async () => {
    if (!displayTarget || !commentText.trim() || isSubmitting || !commentsEnabled) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (displayTarget.variant === "response") {
        await commentOnResponse({ responseId: displayTarget.id, commentText: commentText.trim() }).unwrap();
      } else {
        await commentOnForumPost({ postId: displayTarget.id, commentText: commentText.trim() }).unwrap();
      }
      setCommentText("");
    } catch (err) {
      // Previously an empty catch: a failed comment vanished with no feedback
      // at all, which is indistinguishable from it having been posted.
      setSubmitError((err as { message?: string })?.message ?? "Couldn't post your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [commentOnResponse, commentOnForumPost, commentText, commentsEnabled, displayTarget, isSubmitting]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void handleSubmit();
      }
    },
    [handleSubmit]
  );

  if (!isRendered || !displayTarget) return null;

  const previewProps =
    displayTarget.variant === "post"
      ? {
        variant: "post" as const,
        title: displayTarget.title,
        body: displayTarget.body,
        author: displayTarget.author,
        time: displayTarget.time,
        avatar: displayTarget.avatar,
      }
      : {
        variant: "response" as const,
        rank: displayTarget.rank,
        subtitle: displayTarget.subtitle,
        promptTitle: displayTarget.promptTitle,
        text: displayTarget.text,
        userName: displayTarget.userName,
        school: displayTarget.school,
        avatarSrc: displayTarget.avatarSrc,
      };

  return (
    <div className="fixed inset-0 z-60" role="dialog" aria-modal="true" aria-label="Comments">
      <button
        type="button"
        className={`absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px] cursor-pointer transition-opacity duration-300 ease-out ${isPanelOpen ? "opacity-100" : "opacity-0"
          }`}
        aria-label="Close comments"
        onClick={handleClose}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[min(100vw,420px)] flex-col bg-[#fcfbf8] border-l border-neutral-200/60 shadow-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-neutral-200/50 shrink-0">
          <div>
            <h2 className="text-[16px] md:text-[20px] font-sfpro font-bold uppercase tracking-wider text-neutral-700">
              Comments
            </h2>
            <p className="text-[11px] md:text-[13px] font-lato font-medium text-neutral-400 mt-0.5">
              {liveCommentCount}{" "}
              {liveCommentCount === 1 ? "comment" : "comments"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 bg-[#faf9f6] text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 transition-all cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 space-y-4">
          <ThreadPreview target={previewProps} likeCount={displayTarget.likeCount} />

          <div className="space-y-3">
            <span className="text-[11px] md:text-[13px] font-lato font-bold tracking-[0.12em] text-neutral-500 uppercase flex items-center gap-2">
              All comments
              {commentsAreRefreshing && !commentsAreLoading && (
                <span
                  className="w-3 h-3 rounded-full border-[1.5px] border-neutral-300 border-t-neutral-500 animate-spin"
                  role="status"
                  aria-label="Refreshing comments"
                />
              )}
            </span>

            {commentsAreLoading ? (
              <div className="bg-white/60 rounded-[10px] p-6 text-center border border-dashed border-neutral-300/60">
                <p className="text-[13px] md:text-[16px] font-lato font-semibold text-neutral-500">
                  Loading comments...
                </p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
            ) : (
              <div className="bg-white/60 rounded-[10px] p-6 text-center border border-dashed border-neutral-300/60">
                <p className="text-[13px] md:text-[16px] font-lato font-semibold text-neutral-500">
                  No comments yet
                </p>
                <p className="text-[11px] md:text-[13px] font-lato text-neutral-400 mt-1">
                  Be the first to share your thoughts
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 px-4 md:px-5 py-4 border-t border-neutral-200/50 bg-[#faf9f6]">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 shrink-0">
              <Image
                src="/images/ron-avatar.png"
                alt="Your avatar"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  if (submitError) setSubmitError(null);
                }}
                onKeyDown={handleKeyDown}
                disabled={!commentsEnabled}
                placeholder={commentsEnabled ? "Add a comment..." : "Scoring is closed"}
                enterKeyHint="send"
                /* 16px on mobile is the exact threshold below which iOS Safari
                   force-zooms a focused input and never zooms back out. */
                className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 font-lato text-[16px] md:text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!commentText.trim() || isSubmitting || !commentsEnabled}
              className="px-4 py-2 rounded-lg bg-[#584939] text-white font-lato text-[11px] md:text-[13px] font-bold transition-all hover:bg-[#43382f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending…" : "Send"}
            </button>
          </div>

          {submitError && (
            <p className="mt-2 font-lato text-[12px] md:text-[13px] font-semibold text-[#b0453a]" role="alert">
              {submitError}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}