import type { Metadata } from "next";
import { Suspense } from "react";

import { WaitlistReferralInitializer } from "@/app/components/providers/WaitlistReferralInitializer";

import "@/styles/join.css";

export const metadata: Metadata = {
  title: "Join the waitlist — Bubba",
  description: "Join the Bubba waitlist for early access in your city.",
};

/**
 * The four legacy artboard stylesheets are gone — the flow no longer renders
 * pixel-mapped overlays, so waitlist.css and friends had nothing left to
 * style here. The referral initialiser stays: it reads ?ref= off the URL and
 * seeds the redux form before any step mounts.
 */
export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <WaitlistReferralInitializer />
      {children}
    </Suspense>
  );
}
