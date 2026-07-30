"use client";

import StandingSection from "@/app/components/dashboard/StandingSection";

export default function StandingPage() {
  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8">
      <title>Your Standing - Ambassador Dashboard</title>
      <meta
        name="description"
        content="View your full campus, market, and national standing on the Bea Ambassador Dashboard."
      />
      <StandingSection variant="all" />
    </main>
  );
}
