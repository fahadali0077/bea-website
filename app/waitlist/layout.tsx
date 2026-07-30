import type { Metadata } from "next";
import { Suspense } from "react";

import { WaitlistReferralInitializer } from "@/app/components/providers/WaitlistReferralInitializer";

import "@/styles/waitlist-fonts.css";
import "@/styles/waitlist.css";
import "@/styles/waitlist-mobile.css";
import "@/styles/waitlist-coded.css";

export const metadata: Metadata = {
  title: "Join the waitlist — Bea",
  description: "Together, today. Join the Bea waitlist for early access.",
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="waitlist-artboard-root">
      <Suspense fallback={null}>
        <WaitlistReferralInitializer />
      </Suspense>
      {children}
    </div>
  );
}
