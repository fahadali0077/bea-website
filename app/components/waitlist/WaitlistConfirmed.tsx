"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Copy, Heart } from "lucide-react";

import { WAITLIST_ARTBOARDS } from "@/lib/waitlist";
import { WAITLIST_CONFIRMED_CONTENT } from "@/lib/waitlist-page-content";

import { WaitlistCheckBadge } from "./WaitlistCheckBadge";
import { WaitlistPerkCards } from "./WaitlistPerkCards";
import { WaitlistShareIcons } from "./WaitlistShareIcons";

export function WaitlistConfirmed() {
  const meta = WAITLIST_ARTBOARDS["8"];
  const content = WAITLIST_CONFIRMED_CONTENT;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.origin + "/waitlist").then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  };

  return (
    <div className="waitlist-root waitlist-coded waitlist-confirmed-root">
      <header className="waitlist-confirmed-bar">
        <Link href={meta.backHref!} className="waitlist-back" aria-label="Go back">
          <ArrowLeft size={24} strokeWidth={1.75} />
        </Link>
        <Link href={content.waitingRoom.href} className="waitlist-waiting-room">
          {content.waitingRoom.label}
          <span aria-hidden> ↗</span>
        </Link>
      </header>

      <div className="waitlist-confirmed">
        <WaitlistCheckBadge />

        <h1 className="waitlist-confirmed-title">{content.title}</h1>
        <p className="waitlist-confirmed-sub">{content.subtitle}</p>

        <div className="waitlist-rank-card">
          <p className="waitlist-rank-eyebrow">{content.rankEyebrow}</p>
          <p className="waitlist-rank-number">{content.rankNumber}</p>
          <p className="waitlist-rank-city">{content.rankCity}</p>

          <div className="waitlist-rank-divider" />

          <div className="waitlist-rank-progress-label">
            <span>{content.progressLabel}</span>
            <span>{content.progressPercent}</span>
          </div>
          <div className="waitlist-rank-progress-bar">
            <div
              className="waitlist-rank-progress-fill"
              style={{ width: content.progressPercent }}
            />
          </div>
          <p className="waitlist-rank-hint">{content.progressHint}</p>
        </div>

        <div className="waitlist-section-divider">{content.perksEyebrow}</div>
        <WaitlistPerkCards />

        <div className="waitlist-section-divider">{content.shareEyebrow}</div>
        <WaitlistShareIcons />

        <button
          type="button"
          className="waitlist-btn-primary waitlist-btn-primary--compact waitlist-confirmed-copy"
          onClick={handleCopy}
        >
          <Copy size={16} strokeWidth={2} aria-hidden />
          <span>{copied ? "Link copied!" : content.copyLabel}</span>
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
