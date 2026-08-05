"use client";

import RecentActivitySection from "@/app/components/dashboard/RecentActivitySection";

export default function AllActivitiesPage() {
  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8">
      <title>All Activity - Ambassador Dashboard</title>
      <meta
        name="description"
        content="Browse all recent activity from your school and market community on the Bea Ambassador Dashboard."
      />

      <RecentActivitySection variant="all" />
    </main>
  );
}
