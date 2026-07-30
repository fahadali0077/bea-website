"use client";

import FeaturedRewardsSection from "@/app/components/dashboard/FeaturedRewardsSection";

export default function AllPrizesPage() {
  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8">
      <title>All Prizes - Ambassador Dashboard</title>
      <meta
        name="description"
        content="Browse all waitlist prizes and rewards you can redeem with your ambassador points."
      />
      <FeaturedRewardsSection variant="all" />
    </main>
  );
}
