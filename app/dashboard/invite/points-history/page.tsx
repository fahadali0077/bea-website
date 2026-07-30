"use client";

import PointsHistorySection from "@/app/components/dashboard/PointsHistorySection";

export default function PointsHistoryPage() {
  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8">
      <title>Points History - Ambassador Dashboard</title>
      <meta
        name="description"
        content="View your full points history — every earn and redeem transaction on the Bea Ambassador Dashboard."
      />
      <PointsHistorySection />
    </main>
  );
}
