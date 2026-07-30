"use client";

import { RewardsMobile } from "./RewardsMobile";
import { RewardsDesktop } from "./RewardsDesktop";

export default function RewardsPage() {
  return (
    <>
      <title>Rewards - Ambassador Dashboard</title>
      <meta
        name="description"
        content="Track your rank, see waitlist prizes, points breakdown, and individual or school rewards."
      />

      {/* Mobile view — shown below lg breakpoint */}
      <div className="rewards-mobile">
        <RewardsMobile />
      </div>

      {/* Desktop view — shown at lg and above */}
      <div className="rewards-desktop">
        <RewardsDesktop />
      </div>
    </>
  );
}
