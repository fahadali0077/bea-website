"use client";

import { Building2, Copy, Globe, MapPin, Trophy, User, Users } from "lucide-react";
import { useState } from "react";

import { PRIZE_LEVEL_ROWS, type OnboardingPageKey } from "@/lib/onboarding-page-content";
import { fontAptos } from "@/lib/design";

import { AccountMobileForm } from "./AccountMobileForm";

const AMBASSADOR_LINK = "datebea.com/link/";

const SHARE_CHANNELS = [
  { label: "Instagram", icon: "instagram" as const, src: "/images/share/instagram.png" },
  { label: "Messages", icon: "messages" as const, src: "/images/share/messages.png" },
  { label: "Whatsapp", icon: "whatsapp" as const, src: "/images/share/whatsapp.png" },
  { label: "Share link", icon: "share" as const, src: "/images/share/share-link.png" },
];

function ShareChannelIcon({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={20}
      height={20}
      className="h-[20px] w-[20px] object-contain"
      draggable={false}
      aria-hidden
    />
  );
}

function PrizeLevelIcon({ type }: { type: (typeof PRIZE_LEVEL_ROWS)[number]["icon"] }) {
  const className = "h-[18px] w-[18px] text-[#1a1a1a]";
  if (type === "campus") return <Building2 className={className} strokeWidth={1.5} />;
  if (type === "market") return <MapPin className={className} strokeWidth={1.5} />;
  return <Trophy className={className} strokeWidth={1.5} />;
}

function SchoolCard() {
  return (
    <div className="onboarding-mobile-card">
      <p className="onboarding-mobile-card-eyebrow">YOUR SCHOOL</p>
      <h3 className="onboarding-mobile-card-title font-canela onboarding-heading">
        University of Connecticut
      </h3>
      <div className="onboarding-spots" aria-label="2 of 5 spots claimed">
        <span className="onboarding-spot onboarding-spot--filled" />
        <span className="onboarding-spot onboarding-spot--filled" />
        <span className="onboarding-spot" />
        <span className="onboarding-spot" />
        <span className="onboarding-spot" />
      </div>
      <p className="onboarding-spots-label">2 of 5 spots claimed</p>
    </div>
  );
}

function ImpactEquation() {
  return (
    <div className="onboarding-impact-card">
      <div className="onboarding-impact-item">
        <span className="onboarding-impact-icon" aria-hidden>
          <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </span>
        <span className="onboarding-impact-label">Your invites</span>
      </div>
      <span className="onboarding-impact-op" aria-hidden>
        +
      </span>
      <div className="onboarding-impact-item">
        <span className="onboarding-impact-icon" aria-hidden>
          <Users className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </span>
        <span className="onboarding-impact-label">Their invites</span>
      </div>
      <span className="onboarding-impact-op" aria-hidden>
        =
      </span>
      <div className="onboarding-impact-item">
        <span className="onboarding-impact-icon" aria-hidden>
          <Globe className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </span>
        <span className="onboarding-impact-label">People reached</span>
      </div>
    </div>
  );
}

function YoureInLinkCard() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(AMBASSADOR_LINK);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  }

  return (
    <div className="onboarding-mobile-card onboarding-link-card">
      <p className="onboarding-mobile-card-eyebrow">YOUR AMBASSADOR LINK</p>
      <div className="onboarding-link-row">
        <p className="onboarding-link-text font-canela onboarding-heading">{AMBASSADOR_LINK}</p>
        <button
          type="button"
          className="onboarding-copy-btn"
          aria-label={copied ? "Copied" : "Copy link"}
          onClick={copyLink}
        >
          <Copy className="h-[16px] w-[16px]" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export function YoureInShareSection() {
  return (
    <div className="onboarding-share-block">
      <div className="onboarding-share-divider">
        <span>SHARE YOUR LINK</span>
      </div>

      <div className="onboarding-share-grid">
        {SHARE_CHANNELS.map(({ label, src }) => (
          <button key={label} type="button" className="onboarding-share-item">
            <span className="onboarding-share-icon" aria-hidden>
              <ShareChannelIcon src={src} />
            </span>
            <span className="onboarding-share-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function YoureInContent() {
  return (
    <div className="onboarding-youre-in">
      <YoureInLinkCard />
    </div>
  );
}

export function OnboardingMobileContent({ pageKey }: { pageKey: OnboardingPageKey }) {
  if (pageKey === "your-school") {
    return (
      <>
        <SchoolCard />
        <p className="onboarding-market-note" style={{ fontFamily: fontAptos }}>
          one of 8 schools participating in Hartford, CT.
        </p>
      </>
    );
  }

  if (pageKey === "prizes") {
    return (
      <ul className="onboarding-prize-rows">
        {PRIZE_LEVEL_ROWS.map((row) => (
          <li key={row.title} className="onboarding-prize-row">
            <span className="onboarding-prize-row-icon" aria-hidden>
              <PrizeLevelIcon type={row.icon} />
            </span>
            <div className="onboarding-prize-row-text">
              <p className="onboarding-prize-row-title">{row.title}</p>
              <p className="onboarding-prize-row-desc">{row.description}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (pageKey === "account") {
    return <AccountMobileForm />;
  }

  if (pageKey === "invites") {
    return <ImpactEquation />;
  }

  if (pageKey === "youre-in") {
    return <YoureInContent />;
  }

  return null;
}
