"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LaunchHeader } from "./LaunchHeader";
import { getReachedStepIndex, stepIndexFromPath } from "@/lib/onboarding-progress";

const TOKEN_KEY = "ambassador_onboarding_token";

export function LaunchShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [hasInvite, setHasInvite] = useState(false);
  const [outOfOrder, setOutOfOrder] = useState(false);

  useEffect(() => {
    setChecked(false);
    setOutOfOrder(false);

    const token = sessionStorage.getItem(TOKEN_KEY) ?? "";
    const invited = Boolean(token);
    setHasInvite(invited);

    if (invited) {
      const currentStep = stepIndexFromPath(pathname);
      const reachedStep = getReachedStepIndex();

      if (currentStep > reachedStep) {
        // Trying to open a later step directly (typed URL, old bookmark,
        // browser-forward past where they actually got to) — send them back
        // to the start instead of letting them into a step whose earlier
        // steps they haven't actually completed.
        setOutOfOrder(true);
        router.replace("/onboarding");
        return;
      }
    }

    setChecked(true);
  }, [pathname, router]);

  return (
    <div className="launch-shell">
      <div className="launch-card">
        <LaunchHeader />
        <main>
          {outOfOrder ? (
            <section className="launch-step launch-step--invite-gate">
              <div className="launch-step-inner launch-step-inner--centered">
                <p className="launch-eyebrow">One moment</p>
                <h1 className="launch-title font-canela onboarding-heading">
                  Let&apos;s pick up where you left off.
                </h1>
                <p className="launch-subtitle">
                  Your onboarding isn&apos;t finished yet — taking you back to the
                  start so you can continue through each step in order.
                </p>
              </div>
            </section>
          ) : !checked ? null : hasInvite ? (
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