/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCreateForumPostMutation } from "@/features/api/apiSlice";
import type { ForumScope } from "@/lib/api/forum.types";

const CLOSE_DURATION_MS = 280;

interface CreateForumPostSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScope?: ForumScope;
}

export function CreateForumPostSidebar({ isOpen, onClose, defaultScope = "CAMPUS" }: CreateForumPostSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scope, setScope] = useState<ForumScope>(defaultScope);
  const [submitted, setSubmitted] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [createPost, { isLoading }] = useCreateForumPostMutation();

  useEffect(() => {
    if (isOpen) {
      setScope(defaultScope);
      requestAnimationFrame(() => setIsVisible(true));
      setTimeout(() => titleInputRef.current?.focus(), 320);
    } else {
      setIsVisible(false);
      const t = setTimeout(() => {
        setTitle("");
        setBody("");
        setSubmitted(false);
      }, CLOSE_DURATION_MS + 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, defaultScope]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, CLOSE_DURATION_MS);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || isLoading) return;
    try {
      await createPost({
        title: title.trim(),
        body: body.trim(),
        scope,
      }).unwrap();
      setSubmitted(true);
    } catch {
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-[280ms]"
        style={{ opacity: isVisible ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Create new forum post"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-[#faf9f6] shadow-[-8px_0_40px_rgba(0,0,0,0.12)] flex flex-col transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ transform: isVisible ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-200/60 shrink-0">
          <div>
            <p className="font-sfpro text-[10px] font-bold tracking-[0.18em] text-[#908343] uppercase">
              Forum
            </p>
            <h2 className="font-canela text-[18px] text-neutral-900 leading-snug mt-0.5">
              Start a new post
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-800 transition-colors shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#e7f0ea] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#3d7a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-canela text-[22px] text-neutral-900 leading-tight">Post created!</h3>
                <p className="font-lato text-[13px] font-medium text-neutral-500 mt-2 max-w-[260px]">
                  Your post has been published to the community forum.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 bg-[#1b1b1b] hover:bg-black text-white font-lato text-[13px] font-bold px-6 py-3 rounded-[8px] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5 h-full">
              {/* Scope Selection */}
              <div className="flex flex-col gap-2">
                <label htmlFor="post-scope" className="font-lato text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Audience Scope
                </label>
                <div className="relative">
                  <select
                    id="post-scope"
                    value={scope}
                    onChange={(e) => setScope(e.target.value as ForumScope)}
                    className="w-full appearance-none bg-white border border-neutral-200 rounded-[10px] px-4 py-3 font-lato text-[14px] text-neutral-800 focus:outline-none focus:border-[#584939] focus:ring-1 focus:ring-[#584939]/30 transition-all cursor-pointer"
                  >
                    <option value="CAMPUS">Campus (Your School)</option>
                    <option value="MARKET">Market (Your City)</option>
                    <option value="NATIONAL">National</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label htmlFor="post-title" className="font-lato text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Title
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  id="post-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best coffee shops on campus?"
                  className="w-full bg-white border border-neutral-200 rounded-[10px] px-4 py-3 font-lato text-[14px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#584939] focus:ring-1 focus:ring-[#584939]/30 transition-all"
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="post-body" className="font-lato text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Content
                </label>
                <textarea
                  id="post-body"
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="What's on your mind? Share tips, ask questions, or start a discussion..."
                  rows={8}
                  className="w-full flex-1 resize-none bg-white border border-neutral-200 rounded-[10px] px-4 py-3.5 font-lato text-[14px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#584939] focus:ring-1 focus:ring-[#584939]/30 transition-all leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !title.trim() || !body.trim()}
                className="w-full bg-[#1b1b1b] hover:bg-black disabled:opacity-50 text-white font-lato text-[14px] font-bold px-5 py-3.5 rounded-[8px] transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Creating…
                  </>
                ) : (
                  "Create post"
                )}
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}
