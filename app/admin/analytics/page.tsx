"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, CheckCircle2, Coins, Download, Gift, Loader2, RefreshCw, UserPlus, Users } from "lucide-react";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { RankedList } from "@/app/components/admin/RankedList";
import { ParticipationChart } from "@/app/components/admin/ParticipationChart";
import { ScopeDonut } from "@/app/components/admin/ScopeDonut";
import {
  analyticsExportUrl,
  getAnalytics,
  type AnalyticsFilters,
  type ApiAnalytics,
} from "@/lib/admin/analytics-api";

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
      <h2 className="font-lato text-[16px] font-bold text-neutral-800">{title}</h2>
      {subtitle && <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">{subtitle}</p>}
      <div className="mt-4 flex-1 flex flex-col">{children}</div>
    </section>
  );
}

const inputClass =
  "w-full font-lato text-[13px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";

const CATEGORY_COLORS: Record<string, string> = {
  invite: "#3d7a6e",
  prompt: "#c48b58",
  like: "#5b6b7d",
  comment: "#8a6a3f",
  winner_bonus: "#b0843a",
  admin_adjustment: "#b0453a",
};

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function todayMinus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function ReconciliationPanel({ data }: { data: ApiAnalytics }) {
  const checks = [
    ["Participation", data.reconciliation.participationEventsMatch],
    ["Points", data.reconciliation.pointsTotalMatches],
    ["Referrals", data.reconciliation.referralTotalMatches],
    ["Rewards", data.reconciliation.rewardTotalMatches],
  ] as const;

  return (
    <Panel title="Reconciliation" subtitle="Dashboard totals compared against source tables.">
      <div className="grid grid-cols-2 gap-3">
        {checks.map(([label, ok]) => (
          <div key={label} className="flex items-center gap-2 rounded-[8px] border border-neutral-200/70 bg-white px-3 py-2.5">
            <CheckCircle2 className={`w-4 h-4 ${ok ? "text-[#3d7a6e]" : "text-[#b0453a]"}`} />
            <span className="font-lato text-[13px] font-bold text-neutral-700">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.entries(data.reconciliation.sourceCounts).map(([key, value]) => (
          <div key={key} className="font-lato text-[12px] text-neutral-500 flex justify-between gap-3 border-b border-neutral-200/40 py-1.5">
            <span>{titleCase(key)}</span>
            <strong className="text-neutral-800">{value.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default function AdminAnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({ from: todayMinus(29), to: todayMinus(0) });
  const [draft, setDraft] = useState<AnalyticsFilters>(filters);
  const [data, setData] = useState<ApiAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getAnalytics(filters);
        setData(res);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters]);

  const applyFilters = () => {
    setFilters({
      from: draft.from || undefined,
      to: draft.to || undefined,
      schoolId: draft.schoolId?.trim() || undefined,
      marketId: draft.marketId?.trim() || undefined,
      competitionId: draft.competitionId?.trim() || undefined,
    });
  };

  const resetFilters = () => {
    const next = { from: todayMinus(29), to: todayMinus(0) };
    setDraft(next);
    setFilters(next);
  };

  const categoryParticipation = useMemo(() => {
    if (!data) return [];
    return data.pointsByCategory.map((item) => ({
      label: titleCase(item.category),
      value: item.entries,
      color: CATEGORY_COLORS[item.category] ?? "#584939",
    }));
  }, [data]);

  if (loading && !data) {
    return (
      <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
        <PageHeading title="Analytics" subtitle="Participation, active users, referrals, points, rewards, and ambassador performance." />
        <div className="py-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
        <PageHeading title="Analytics" subtitle="Participation, active users, referrals, points, rewards, and ambassador performance." />
        <div className="bg-[#b0453a]/10 border border-[#b0453a]/20 rounded-[12px] p-4 text-[#b0453a] text-[14px] font-medium">
          {error ?? "Failed to load analytics data"}
        </div>
      </main>
    );
  }

  const { overview, signupsBySchool, signupsByMarket, pointsByCategory, topAmbassadors, dailyMetrics } = data;
  const schoolsList = signupsBySchool.map((s) => ({ label: s.schoolName ?? "Unknown", value: s.count }));
  const marketsList = signupsByMarket.map((m) => ({ label: m.marketName ?? "Unknown", value: m.count }));
  const ambassadorPerformance = topAmbassadors.map((a) => ({ label: a.name, value: a.networkSize }));
  const rewardStatuses = data.rewardsByStatus.map((item) => ({ label: titleCase(item.status), value: item.count }));
  const referralStatuses = data.referralsByStatus.map((item) => ({ label: titleCase(item.status), value: item.count }));

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Analytics - Bea Admin</title>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <PageHeading title="Analytics" subtitle="Participation, active users, referrals, points, rewards, and ambassador performance." />
        <a
          href={analyticsExportUrl(filters)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 font-lato text-[13px] font-bold text-white hover:bg-neutral-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </a>
      </div>

      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <input type="date" value={draft.from ?? ""} onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} className={inputClass} />
          <input type="date" value={draft.to ?? ""} onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} className={inputClass} />
          <input value={draft.schoolId ?? ""} onChange={(event) => setDraft((current) => ({ ...current, schoolId: event.target.value }))} placeholder="School ID" className={inputClass} />
          <input value={draft.marketId ?? ""} onChange={(event) => setDraft((current) => ({ ...current, marketId: event.target.value }))} placeholder="Market ID" className={inputClass} />
          <input value={draft.competitionId ?? ""} onChange={(event) => setDraft((current) => ({ ...current, competitionId: event.target.value }))} placeholder="Competition ID" className={inputClass} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={applyFilters} className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 font-lato text-[13px] font-bold text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Apply
          </button>
          <button type="button" onClick={resetFilters} className="rounded-full border border-neutral-200 px-4 py-2 font-lato text-[13px] font-bold text-neutral-700 bg-white">
            Reset
          </button>
          <p className="font-lato text-[12px] text-neutral-500">
            Showing {data.filters.from} to {data.filters.to}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={overview.totalUsers.toLocaleString()} icon={<Users className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="New Users" value={overview.newUsers.toLocaleString()} icon={<UserPlus className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Active Users" value={overview.activeUsers.toLocaleString()} icon={<Activity className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Participating Users" value={overview.participatingUsers.toLocaleString()} icon={<Users className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Participation Events" value={overview.totalParticipationEvents.toLocaleString()} icon={<Activity className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Referrals" value={overview.totalReferrals.toLocaleString()} icon={<UserPlus className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Points Earned" value={overview.totalPointsEarned.toLocaleString()} icon={<Coins className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Rewards Redeemed" value={overview.totalRewardsRedeemed.toLocaleString()} icon={<Gift className="w-5 h-5" strokeWidth={2.2} />} />
      </div>

      <Panel title="Definitions" subtitle="Current metric definitions pending Product/QA approval if the SRS requires different wording.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <p className="font-lato text-[13px] text-neutral-600 bg-white rounded-[8px] border border-neutral-200/70 p-3">{data.definitions.activeUsers}</p>
          <p className="font-lato text-[13px] text-neutral-600 bg-white rounded-[8px] border border-neutral-200/70 p-3">{data.definitions.participation}</p>
        </div>
      </Panel>

      <Panel title="Daily analytics" subtitle="Date-filtered signups, active users, participation, referrals, and points.">
        <ParticipationChart data={dailyMetrics} />
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <Panel title="Participation breakdown" subtitle="Source event counts in the selected range.">
          <RankedList
            items={[
              { label: "Prompt responses", value: data.participation.promptResponses },
              { label: "Likes", value: data.participation.likes },
              { label: "Comments", value: data.participation.comments },
              { label: "Counted referrals", value: data.participation.countedReferrals },
            ]}
            unit="events"
            title="Participation breakdown"
          />
        </Panel>
        <Panel title="Referral statuses" subtitle="Referral source reconciliation by status.">
          <RankedList items={referralStatuses} unit="referrals" title="Referral statuses" />
        </Panel>
        <Panel title="Reward statuses" subtitle="Redemption source reconciliation by status.">
          <RankedList items={rewardStatuses} unit="requests" title="Reward statuses" />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Panel title="Signups by school" subtitle="Date-filtered participants per campus.">
          <RankedList items={schoolsList} unit="users" title="Signups by school" />
        </Panel>
        <Panel title="Signups by market" subtitle="Date-filtered participants per market region.">
          <RankedList items={marketsList} unit="users" title="Signups by market" />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Panel title="Ambassador performance" subtitle="Ranked by counted referral network in the selected range.">
          <RankedList items={ambassadorPerformance} unit="network" title="Ambassador performance" />
        </Panel>
        <Panel title="Point categories" subtitle="Point ledger events by category.">
          <ScopeDonut data={categoryParticipation} />
        </Panel>
        <ReconciliationPanel data={data} />
      </div>

      <Panel title="Point totals by category" subtitle="Reconciled against points_ledger source rows.">
        <RankedList
          items={pointsByCategory.map((item) => ({ label: titleCase(item.category), value: item.totalPoints }))}
          unit="points"
          title="Point totals by category"
        />
      </Panel>
    </main>
  );
}
