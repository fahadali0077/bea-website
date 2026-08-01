/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { YOUREIN_STEP } from "@/lib/launch";
import { CopyButton } from "@/app/components/launch/CopyButton";
import { ShareRow } from "@/app/components/launch/ShareRow";
import { useGetMeQuery } from "@/features/api/apiSlice";

export function YoureInStep() {
  const { eyebrow, title, subtitleLines, linkLabel, shareHeading, nextUp } = YOUREIN_STEP;
  const { data: me, isLoading } = useGetMeQuery();

  const [referralLink, setReferralLink] = useState<string | null>(null);

  useEffect(() => {
    if (me?.user?.referralCode && typeof window !== "undefined") {
      setReferralLink(`${window.location.origin}/link/${me.user.referralCode}`);
    }
  }, [me]);

  return (
    <section className="launch-step launch-step--ambassador">
      <div className="launch-step-inner launch-step-inner--centered launch-step-inner--ambassador">
        <div className="ambassador-content">
          <span className="launch-welcome-icon" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="3.2" />
              <path d="M20.5 8.5c.8-.8.8-2.1 0-2.9" />
              <path d="M19 3.4c1.6.2 2.9 1.5 2.9 3.2" />
            </svg>
          </span>
          <p className="launch-eyebrow">{eyebrow}</p>
          <h1 className="launch-title font-canela onboarding-heading">{title}</h1>
          <p className="launch-subtitle">
            {subtitleLines[0]}
            <br />
            {subtitleLines[1]}
          </p>

          <p className="launch-welcome-link-label">{linkLabel}</p>
          <div className="launch-welcome-card">
            {referralLink ? (
              <>
                <p className="launch-welcome-link font-canela onboarding-heading">
                  {referralLink.replace(/^https?:\/\//, "")}
                </p>
                <CopyButton value={referralLink} />
              </>
            ) : (
              // Never render a stand-in link — a fake URL is worse than a wait,
              // since it can be copied and shared before the real one loads.
              <p className="launch-welcome-link-pending">
                {isLoading ? "Preparing your link…" : "Your invite link will appear here shortly."}
              </p>
            )}
          </div>

          <p className="launch-share-heading">{shareHeading}</p>
          <ShareRow link={referralLink} />

          <div className="launch-next-up">
            <p className="launch-next-up-label">{nextUp.label}</p>
            <p className="launch-next-up-text">{nextUp.text}</p>
            <Link href={nextUp.cta.href} className="launch-next-up-link cursor-pointer">
              {nextUp.cta.label}
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="ambassador-art">
          <Image
            src="/images/onboarding/beach-panorama.png"
            alt=""
            width={1216}
            height={874}
            className="launch-illustration launch-illustration--panorama"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}