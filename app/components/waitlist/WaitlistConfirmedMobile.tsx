"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Copy, Heart } from "lucide-react";

import { useJoinWaitlistRankPosition } from "@/features/waitlist/useJoinWaitlistRankPosition";
import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { WAITLIST_ARTBOARDS } from "@/lib/waitlist";
import { formatWaitlistRankNumber, readStoredJoinResult } from "@/lib/waitlist-join-storage";
import { WAITLIST_CONFIRMED_CONTENT } from "@/lib/waitlist-page-content";
import { useAppSelector } from "@/store/hooks";

import { WaitlistCheckBadge } from "./WaitlistCheckBadge";
import { WaitlistPerkCards } from "./WaitlistPerkCards";
import { WaitlistShareIcons } from "./WaitlistShareIcons";

export function WaitlistConfirmedMobile() {
  const meta = WAITLIST_ARTBOARDS["8"];
  const content = WAITLIST_CONFIRMED_CONTENT;
  const rankPosition = useJoinWaitlistRankPosition();
  const form = useAppSelector(selectWaitlistForm);
  const [magicLink] = useState<string | null>(() => {
    return readStoredJoinResult()?.magicLink ?? null;
  });

  const marketLabel = form.marketName;
  const rankNumber = formatWaitlistRankNumber(rankPosition);
  const rankCity = marketLabel ? `in ${marketLabel}` : content.rankCity;

  const progressLabel = form.marketName
    ? `${form.marketName.toUpperCase()} PROGRESS`
    : content.progressLabel;

  const referralLink =
    typeof window !== "undefined" ? `${window.location.origin}/waitlist` : "/waitlist";

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="waitlist-root">
      <div className="waitlist-confirmed">
        <div className="waitlist-confirmed-top">
          <Link href={meta.backHref!} className="waitlist-back" aria-label="Go back">
            <ChevronLeft size={22} strokeWidth={1.75} />
          </Link>
          <Link href={content.waitingRoom.href} className="waitlist-waiting-room">
            {content.waitingRoom.label}
            <span aria-hidden> ↗</span>
          </Link>
        </div>

        <WaitlistCheckBadge />

        <h1 className="waitlist-confirmed-title">{content.title}</h1>
        <p className="waitlist-confirmed-sub">{content.subtitle}</p>

        {magicLink && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[12px] p-4 text-emerald-800 text-[13px] font-medium flex flex-col gap-3 my-4">
            <p className="font-bold text-[14px]">Verification Link Generated</p>
            <p>Bypass email issues by copying this link or clicking below:</p>
            <div className="flex gap-2">
              <a
                href={magicLink}
                className="inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[12px] font-bold px-4 py-2 rounded-full transition-colors cursor-pointer"
              >
                Log in directly
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(magicLink);
                  alert("Link copied!");
                }}
                className="inline-flex items-center justify-center bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-lato text-[12px] font-bold px-4 py-2 rounded-full transition-colors cursor-pointer"
              >
                Copy magic link
              </button>
            </div>
          </div>
        )}

        <div className="waitlist-rank-card">
          <p className="waitlist-rank-eyebrow">{content.rankEyebrow}</p>
          <p className="waitlist-rank-number">{rankNumber ?? "—"}</p>
          <p className="waitlist-rank-city">{rankCity}</p>

          <div className="waitlist-rank-divider" />

          <div className="waitlist-rank-progress-label">
            <span>{progressLabel}</span>
            <span>{content.progressPercent}</span>
          </div>
          <div className="waitlist-rank-progress-bar">
            <div className="waitlist-rank-progress-fill" />
          </div>
          <p className="waitlist-rank-hint">{content.progressHint}</p>
        </div>

        <div className="waitlist-section-divider">{content.perksEyebrow}</div>
        <WaitlistPerkCards />

        <div className="waitlist-section-divider">{content.shareEyebrow}</div>
        <WaitlistShareIcons />

        <button
          type="button"
          className="waitlist-btn-primary waitlist-btn-primary--compact"
          onClick={handleCopyLink}
        >
          <Copy size={16} strokeWidth={2} aria-hidden />
          <span>{content.copyLabel}</span>
        </button>

        <div className="waitlist-confirmed-footer">
          <Heart size={14} strokeWidth={1.5} aria-hidden className="waitlist-confirmed-heart" />
          <p>{content.footerThankYou}</p>
          <p className="waitlist-confirmed-footer-muted">{content.footerClosing}</p>
        </div>
      </div>
    </div>
  );
}
