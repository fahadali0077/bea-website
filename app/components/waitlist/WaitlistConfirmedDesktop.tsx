"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Crown,
  Sprout,
  Instagram,
  MessageCircle,
  Copy,
} from "lucide-react";

import { useJoinWaitlistRankPosition } from "@/features/waitlist/useJoinWaitlistRankPosition";
import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { WAITLIST_ARTBOARDS } from "@/lib/waitlist";
import { formatWaitlistRankNumber, readStoredJoinResult } from "@/lib/waitlist-join-storage";
import { WAITLIST_CONFIRMED_CONTENT } from "@/lib/waitlist-page-content";
import { useAppSelector } from "@/store/hooks";

import { WaitlistCheckBadge } from "./WaitlistCheckBadge";

const emptySubscribe = () => () => {};

function WhatsappIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5.1 5.2-1.4A10 10 0 1 0 12 2z" />
      <path d="M9.5 9.5c.3 1.6 1.8 3.8 4 4.8 1 .5 1.8.6 2.4.5l1-1.1c.2-.2.1-.5-.1-.7l-1.2-1c-.2-.2-.5-.2-.7 0l-.8.7c-.1.1-.3.1-.5 0-1-.4-2.2-1.6-2.5-2.4-.1-.2 0-.4.1-.5l.7-.8c.2-.2.2-.5 0-.7l-1-1.2c-.2-.2-.5-.3-.7-.1l-1.1 1c-.2.5-.1 1.3.4 2.3z" />
    </svg>
  );
}

const PERK_ICONS = {
  early: Sprout,
  time: Clock,
  premium: Crown,
} as const;

const SHARE_LINKS = [
  { label: "Instagram", Icon: Instagram },
  { label: "Messages", Icon: MessageCircle },
  { label: "Whatsapp", Icon: WhatsappIcon },
] as const;

export function WaitlistConfirmedDesktop() {
  const meta = WAITLIST_ARTBOARDS["8"];
  const content = WAITLIST_CONFIRMED_CONTENT;
  const rankPosition = useJoinWaitlistRankPosition();
  const form = useAppSelector(selectWaitlistForm);
  const [magicLink] = useState<string | null>(() => {
    return readStoredJoinResult()?.magicLink ?? null;
  });
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const marketLabel = mounted ? form.marketName : null;
  const rankNumber = mounted ? formatWaitlistRankNumber(rankPosition) : null;
  const rankCity = marketLabel ? `in ${marketLabel}` : content.rankCity;

  const progressLabel = mounted && form.marketName
    ? `${form.marketName.toUpperCase()} PROGRESS`
    : content.progressLabel;

  const referralLink =
    typeof window !== "undefined" ? `${window.location.origin}/waitlist` : "/waitlist";

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(referralLink);
    alert("Invite link copied to clipboard!");
  };

  return (
    <div className="wld-step8-container">
      <div className="wld-step8-left">
        <div className="wld-step8-top">
          <Link href={meta.backHref!} className="wld-step8-back" aria-label="Go back">
            <ArrowLeft size={24} strokeWidth={2} />
          </Link>
          <Link href="/auth/login" className="wld-step8-waiting-room">
            Check your email to sign in
            <span aria-hidden> ↗</span>
          </Link>
        </div>

        <div className="wld-step8-badge-wrapper">
          <WaitlistCheckBadge />
        </div>

        <div className="wld-step8-header">
          <h1 className="wld-step8-title">{content.title}</h1>
          <p className="wld-step8-subtitle">
            The waiting room commences in <strong>3 days</strong>.
          </p>
        </div>

        {magicLink && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[12px] p-4 text-emerald-800 text-[13px] font-medium flex flex-col gap-3 mb-6">
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

        <div className="wld-step8-rank-card">
          <p className="wld-step8-rank-eyebrow">{content.rankEyebrow}</p>
          <p className="wld-step8-rank-number">{rankNumber ?? "—"}</p>
          <p className="wld-step8-rank-city">{rankCity}</p>

          <div className="wld-step8-rank-divider" />

          <div className="wld-step8-rank-progress-label">
            <span className="wld-step8-progress-text">{progressLabel}</span>
            <span className="wld-step8-progress-percent">{content.progressPercent}</span>
          </div>
          <div className="wld-step8-rank-progress-bar">
            <div
              className="wld-step8-rank-progress-fill"
              style={{ width: content.progressPercent }}
            />
          </div>
          <p className="wld-step8-rank-hint">{content.progressHint}</p>
        </div>

        <div className="wld-step8-section-divider-wrapper">
          <div className="wld-step8-section-divider">{content.perksEyebrow}</div>
        </div>
        <div className="wld-step8-perk-cards">
          {content.perks.map((perk) => {
            const Icon = PERK_ICONS[perk.id];
            return (
              <div
                key={perk.id}
                className={`wld-step8-perk-card ${perk.active ? "wld-step8-perk-card--active" : ""}`}
              >
                <Icon size={24} strokeWidth={1.5} aria-hidden />
                <h4>{perk.title}</h4>
                <p className="wld-step8-perk-card-desc">{perk.description}</p>
                <p className="wld-step8-perk-card-footer">{perk.footer}</p>
              </div>
            );
          })}
        </div>

        <div className="wld-step8-section-divider-wrapper">
          <div className="wld-step8-section-divider">{content.shareEyebrow}</div>
        </div>
        <div className="wld-step8-share-icons">
          {SHARE_LINKS.map(({ label, Icon }) => (
            <button key={label} type="button" className="wld-step8-share-icon">
              <span className="wld-step8-share-icon-circle">
                <Icon size={24} strokeWidth={1.5} aria-hidden />
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <button type="button" onClick={handleCopyLink} className="wld-step8-copy-btn">
          <Copy size={20} strokeWidth={2} style={{ marginRight: "10px" }} />
          <span>{content.copyLabel}</span>
        </button>

        <div className="wld-step8-footer">
          <p className="wld-step8-footer-thankyou">
            <img
              src="/images/assets/heart.png"
              alt="Heart"
              className="wld-step8-heart-img"
            />
            {content.footerThankYou}
          </p>
          <p className="wld-step8-footer-closing">{content.footerClosing}</p>
        </div>
      </div>
    </div>
  );
}
