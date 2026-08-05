"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users, UserPlus, Sparkles, Coins, Loader2 } from "lucide-react";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { getAnalytics, type AnalyticsOverview } from "@/lib/admin/analytics-api";

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getAnalytics();
        setOverview(res.overview);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load overview data");
      } finally {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Overview - Bea Admin</title>

      <PageHeading
        title="Admin Overview"
        subtitle="Manage the Bea waitlist experience, users, and competition."
      />

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : error ? (
        <div className="bg-[#b0453a]/10 border border-[#b0453a]/20 rounded-[12px] p-4 text-[#b0453a] text-[14px] font-medium">
          {error}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={overview.totalUsers.toLocaleString()} icon={<Users className="w-5 h-5" strokeWidth={2.2} />} />
          <StatCard label="Ambassadors" value={overview.totalAmbassadors.toLocaleString()} icon={<UserPlus className="w-5 h-5" strokeWidth={2.2} />} />
          <StatCard label="Today's Signups" value={overview.todaySignups.toLocaleString()} icon={<Sparkles className="w-5 h-5" strokeWidth={2.2} />} />
          <StatCard label="Points Earned" value={overview.totalPointsEarned.toLocaleString()} icon={<Coins className="w-5 h-5" strokeWidth={2.2} />} />
        </div>
      ) : null}

      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-lato text-[16px] md:text-[20px] font-bold text-neutral-800">User Management</h2>
          <p className="font-lato text-[13px] md:text-[15px] font-medium text-neutral-500 mt-1">
            Search, filter, and review every user and ambassador on the platform.
          </p>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          Manage users
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </section>
    </main>
  );
}
