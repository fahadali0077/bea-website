"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Gift, X } from "lucide-react";
import { WAITLIST_PRIZES_DETAIL } from "@/lib/waitlist-page-content";
import "@/styles/waitlist.css";

const ALL_PRIZES_PATH = "/dashboard/rewards/all-prizes";
const TOTAL_PRIZES = 30;
const CLOSE_DURATION_MS = 280;

const SCROLL_CONFIG = {
  dashboard: { initial: 3, loadMore: 0 },
  all: { initial: 6, loadMore: 6 },
} as const;

type FeaturedRewardsVariant = "dashboard" | "all";
type RedeemModalPhase = "confirm" | "success" | "blocked";

export interface RewardItem {
  id: string;
  status: string;
  title: string;
  desc: string[];
  cost: string;
  cta: string;
  pointsCost: number | null;
}

interface FeaturedRewardsSectionProps {
  variant: FeaturedRewardsVariant;
}

interface RedeemModalState {
  reward: RewardItem;
  phase: RedeemModalPhase;
  message?: string;
}

function parseUserPoints(value: string): number {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getRedeemBlockReason(
  reward: RewardItem,
  userPoints: number,
  isRedeemed: boolean
): string | null {
  if (isRedeemed) return "You have already redeemed this reward.";
  if (reward.status === "Locked") return "This reward is still locked. Keep earning points to unlock it.";
  if (reward.status !== "100% Unlocked") {
    return `This reward is ${reward.status.toLowerCase()}. You need 100% unlock before redeeming.`;
  }
  if (reward.pointsCost === null) {
    return "This is a top-tier prize awarded to ambassadors with the most points in the pool.";
  }
  if (userPoints < reward.pointsCost) {
    const shortfall = reward.pointsCost - userPoints;
    return `You need ${shortfall.toLocaleString()} more points to redeem this reward.`;
  }
  return null;
}

const PRIZE_TEMPLATES: Omit<RewardItem, "id" | "pointsCost">[] = [
  {
    status: "100% Unlocked",
    title: "Annual Premium Membership",
    desc: ["Win exclusive Bea merch.", "Hoodie, hat, tote & more."],
    cost: "1200 points",
    cta: "Redeem",
  },
  {
    status: "100% Unlocked",
    title: "Bea merch bundle",
    desc: ["Win exclusive Bea merch.", "Hoodie, hat, tote & more."],
    cost: "1200 points",
    cta: "Redeem",
  },
  {
    status: "100% Unlocked",
    title: "Vintage car & merch package",
    desc: ["Win exclusive Bea merch.", "Hoodie, hat, tote & more."],
    cost: "Most points",
    cta: "Redeem",
  },
];

const EXTRA_PRIZE_TITLES = [
  "Coffee date pass",
  "VIP campus event access",
  "Premium profile boost",
  "Weekend getaway credit",
  "Exclusive dinner for two",
  "Ambassador spotlight feature",
];

const PRIZE_STATUSES = ["100% Unlocked", "75% Unlocked", "50% Unlocked", "Locked"];

function buildAllPrizes(): RewardItem[] {
  return Array.from({ length: TOTAL_PRIZES }, (_, i) => {
    const template = PRIZE_TEMPLATES[i % PRIZE_TEMPLATES.length];
    const title =
      i < PRIZE_TEMPLATES.length
        ? template.title
        : EXTRA_PRIZE_TITLES[i % EXTRA_PRIZE_TITLES.length];

    return {
      id: `prize-${i + 1}`,
      status: PRIZE_STATUSES[i % PRIZE_STATUSES.length],
      title,
      desc: template.desc,
      cost: i % 4 === 3 ? "Most points" : `${900 + i * 50} points`,
      cta: i % 4 === 3 ? "View" : "Redeem",
      pointsCost: i % 4 === 3 ? null : 900 + i * 50,
    };
  });
}

function RewardCardSkeleton({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div
      className={`waitlist-reward-card animate-pulse${fullWidth ? " w-full" : ""}`}
      style={{ background: "#fdfcfb", borderColor: "#f8f1eb", borderRadius: "12px" }}
    >
      <div className="h-5 w-24 bg-neutral-200/60 rounded-full mb-3" />
      <div className="h-5 w-48 bg-neutral-200/50 rounded mb-2" />
      <div className="h-3 w-full max-w-xs bg-neutral-200/40 rounded mb-1" />
      <div className="h-3 w-3/4 max-w-[200px] bg-neutral-200/30 rounded mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 bg-neutral-200/40 rounded" />
        <div className="h-8 w-20 bg-neutral-200/50 rounded" />
      </div>
    </div>
  );
}

function RewardCard({
  reward,
  fullWidth = false,
  isRedeemed = false,
  onAction,
}: {
  reward: RewardItem;
  fullWidth?: boolean;
  isRedeemed?: boolean;
  onAction?: (reward: RewardItem) => void;
}) {
  const buttonLabel = isRedeemed ? "Redeemed" : reward.cta;

  return (
    <div
      className={`waitlist-reward-card${fullWidth ? " w-full" : ""}`}
      style={{ background: "#fdfcfb", borderColor: "#f8f1eb", borderRadius: "12px" }}
    >
      <span className="waitlist-reward-badge" style={{ background: "#f2eee7", color: "#827357" }}>
        {isRedeemed ? "Redeemed" : reward.status}
      </span>
      <h3 className="waitlist-reward-title" style={{ color: "#1a1a1a" }}>
        {reward.title}
      </h3>
      <p className="waitlist-reward-desc" style={{ color: "#6f6a64" }}>
        {reward.desc.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </p>
      <div className="waitlist-reward-foot">
        <span className="waitlist-reward-cost" style={{ color: "#4a3429", fontWeight: 600 }}>
          {reward.cost}
        </span>
        <button
          type="button"
          className="waitlist-reward-redeem"
          style={{
            background: isRedeemed ? "#b8b2aa" : "#1a1a1a",
            color: "#fff",
            cursor: isRedeemed ? "default" : "pointer",
            opacity: isRedeemed ? 0.85 : 1,
          }}
          disabled={isRedeemed}
          onClick={() => onAction?.(reward)}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function RedeemPrizeModal({
  modal,
  userPoints,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  modal: RedeemModalState | null;
  userPoints: number;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!modal) return null;

  const { reward, phase, message } = modal;
  const isBlocked = phase === "blocked";
  const isSuccess = phase === "success";

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Redeem reward">
      <button
        type="button"
        className={`absolute inset-0 bg-neutral-950/45 backdrop-blur-[1px] cursor-pointer transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close redeem dialog"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-[400px] rounded-[14px] border border-[#e3ded6] bg-[#fdfcfb] shadow-2xl transform transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-[0.97] opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-start justify-between gap-3 p-5 border-b border-[#ece6df]">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: "#faf0eb", color: "#d05038" }}
              >
                <Gift size={20} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-lato font-bold uppercase tracking-wider text-[#8b7355]">
                  {isSuccess ? "Redeemed" : isBlocked ? "Unavailable" : "Confirm redemption"}
                </p>
                <h3 className="text-[18px] font-canela font-medium text-[#1a1a1a] leading-tight truncate">
                  {reward.title}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-colors"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {isSuccess ? (
              <p className="text-[14px] font-lato text-[#5a5550] leading-relaxed">
                Your reward has been redeemed. We&apos;ll email you the next steps within 24 hours.
              </p>
            ) : isBlocked ? (
              <p className="text-[14px] font-lato text-[#5a5550] leading-relaxed">{message}</p>
            ) : (
              <>
                <p className="text-[14px] font-lato text-[#5a5550] leading-relaxed">
                  Redeem <span className="font-semibold text-[#1a1a1a]">{reward.title}</span> for{" "}
                  <span className="font-semibold text-[#1a1a1a]">{reward.cost}</span>?
                </p>
                <div
                  className="rounded-[10px] border px-4 py-3 flex items-center justify-between"
                  style={{ background: "#f4f0ec", borderColor: "#e3ded6" }}
                >
                  <span className="text-[12px] font-lato font-medium text-[#8a8078]">Your balance</span>
                  <span className="text-[16px] font-lato font-bold text-[#1a1a1a]">
                    {userPoints.toLocaleString()} pts
                  </span>
                </div>
                {reward.pointsCost !== null && (
                  <p className="text-[12px] font-lato text-[#8a8078]">
                    After redeeming:{" "}
                    <span className="font-semibold text-[#4a3429]">
                      {(userPoints - reward.pointsCost).toLocaleString()} pts remaining
                    </span>
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex gap-3 p-5 pt-0">
            {isSuccess || isBlocked ? (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-[10px] py-2.5 text-[13px] font-lato font-bold text-white transition-colors"
                style={{ background: "#1a1a1a" }}
              >
                Done
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 rounded-[10px] border border-[#e3ded6] bg-white py-2.5 text-[13px] font-lato font-bold text-[#4a3429] hover:bg-[#faf9f6] transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="flex-1 rounded-[10px] py-2.5 text-[13px] font-lato font-bold text-white transition-colors disabled:opacity-60"
                  style={{ background: "#1a1a1a" }}
                >
                  {isSubmitting ? "Redeeming…" : "Confirm redeem"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedRewardsSection({ variant }: FeaturedRewardsSectionProps) {
  const isDashboard = variant === "dashboard";
  const { initial: initialCount, loadMore: loadMoreCount } = SCROLL_CONFIG[variant];
  const { featured, points } = WAITLIST_PRIZES_DETAIL;

  const [visibleCount, setVisibleCount] = useState<number>(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userPoints, setUserPoints] = useState(() => parseUserPoints(points.value));
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(() => new Set());
  const [redeemModal, setRedeemModal] = useState<RedeemModalState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allPrizes = useMemo(() => buildAllPrizes(), []);

  const displayedPrizes = useMemo(
    () => allPrizes.slice(0, visibleCount),
    [allPrizes, visibleCount]
  );

  const hasMoreToLoad = !isDashboard && visibleCount < allPrizes.length;

  const closeRedeemModal = useCallback(() => {
    setIsModalOpen(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setRedeemModal(null);
      setIsSubmitting(false);
    }, CLOSE_DURATION_MS);
  }, []);

  const handleRewardAction = useCallback(
    (reward: RewardItem) => {
      const isRedeemed = redeemedIds.has(reward.id);
      if (isRedeemed) return;

      if (reward.cta === "View" || reward.pointsCost === null) {
        setRedeemModal({
          reward,
          phase: "blocked",
          message:
            "This is a top-tier prize awarded to ambassadors with the most points in the pool. Keep earning to stay in the running.",
        });
        setIsModalOpen(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsModalOpen(true));
        });
        return;
      }

      const blockReason = getRedeemBlockReason(reward, userPoints, isRedeemed);
      if (blockReason) {
        setRedeemModal({ reward, phase: "blocked", message: blockReason });
        setIsModalOpen(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsModalOpen(true));
        });
        return;
      }

      setRedeemModal({ reward, phase: "confirm" });
      setIsModalOpen(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsModalOpen(true));
      });
    },
    [redeemedIds, userPoints]
  );

  const handleConfirmRedeem = useCallback(() => {
    if (!redeemModal || redeemModal.phase !== "confirm") return;

    const { reward } = redeemModal;
    if (reward.pointsCost === null) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      setUserPoints((prev) => prev - reward.pointsCost!);
      setRedeemedIds((prev) => new Set(prev).add(reward.id));
      setRedeemModal({ reward, phase: "success" });
      setIsSubmitting(false);
    }, 700);
  }, [redeemModal]);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!hasMoreToLoad || loadMoreCount === 0) return;

    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isLoadingMore) return;

        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + loadMoreCount, allPrizes.length));
          setIsLoadingMore(false);
        }, 600);
      },
      { rootMargin: "120px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreToLoad, isLoadingMore, allPrizes.length, loadMoreCount]);

  const list = (
    <>
      <div className={`waitlist-reward-list${isDashboard ? "" : " w-full"}`}>
        {displayedPrizes.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            fullWidth={!isDashboard}
            isRedeemed={redeemedIds.has(reward.id)}
            onAction={handleRewardAction}
          />
        ))}

        {isLoadingMore && (
          <>
            <RewardCardSkeleton fullWidth={!isDashboard} />
            <RewardCardSkeleton fullWidth={!isDashboard} />
          </>
        )}
      </div>

      {hasMoreToLoad && <div ref={loadMoreRef} className="h-1" aria-hidden />}
    </>
  );

  if (isDashboard) {
    return (
      <>
        <div className="waitlist-prizes-sectionhead" style={{ marginTop: "28px" }}>
          <h2 className="waitlist-card-heading" style={{ color: "#1a1a1a" }}>
            {featured.heading}
          </h2>
          <Link href={ALL_PRIZES_PATH} className="waitlist-prizes-viewall">
            {featured.viewAll}
            <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>
        {list}
        <RedeemPrizeModal
          modal={redeemModal}
          userPoints={userPoints}
          isOpen={isModalOpen}
          isSubmitting={isSubmitting}
          onClose={closeRedeemModal}
          onConfirm={handleConfirmRedeem}
        />
      </>
    );
  }

  return (
    <>
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
            All Prizes
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            Browse every reward you can unlock
          </p>
        </div>
      </div>

      <div className="waitlist-prizes-sectionhead">
        <h2 className="waitlist-card-heading" style={{ color: "#1a1a1a" }}>
          {featured.heading}
        </h2>
      </div>

      {list}
    </section>

    <RedeemPrizeModal
      modal={redeemModal}
      userPoints={userPoints}
      isOpen={isModalOpen}
      isSubmitting={isSubmitting}
      onClose={closeRedeemModal}
      onConfirm={handleConfirmRedeem}
    />
    </>
  );
}
