"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { LaunchHeader } from "./LaunchHeader";

const TOKEN_KEY = "ambassador_onboarding_token";

export function LaunchShell({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [hasInvite, setHasInvite] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY) ?? "";
    setHasInvite(Boolean(token));
    setChecked(true);
  }, []);

  return (
    <div className="launch-shell">
      <div className="launch-card">
        <LaunchHeader />
        <main>
          {!checked ? null : hasInvite ? (
            children
          ) : (
            <section className="launch-step launch-step--invite-gate">
              <div className="launch-step-inner launch-step-inner--centered">
                <p className="launch-eyebrow">Invite only</p>
                <h1 className="launch-title font-canela onboarding-heading">
                  You need an invite to continue.
                </h1>
                <p className="launch-subtitle">
                  Ambassador onboarding is only available to people who&apos;ve been
                  personally invited. If you think this is a mistake, reach out to
                  whoever invited you for a fresh link.
                </p>
                <Link href="/" className="launch-cta cursor-pointer">
                  <span>Back to home</span>
                </Link>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}