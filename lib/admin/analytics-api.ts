import { call, type RawRecord } from "./http";

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  schoolId?: string;
  marketId?: string;
  competitionId?: string;
};

export type AnalyticsOverview = {
  totalUsers: number;
  totalAmbassadors: number;
  newUsers: number;
  todaySignups: number;
  nationalSignups: number;
  activeUsers: number;
  participatingUsers: number;
  totalParticipationEvents: number;
  totalReferrals: number;
  totalPointsEarned: number;
  totalPointEvents: number;
  totalRewardRequests: number;
  totalRewardsUnlocked: number;
  totalRewardsRedeemed: number;
  totalAmbassadorNetwork: number;
};

export type ScopeSignup = {
  schoolId?: string | null;
  schoolName?: string;
  marketId?: string | null;
  marketName?: string;
  count: number;
};

export type PointsByCategory = {
  category: string;
  totalPoints: number;
  entries: number;
};

export type StatusCount = {
  status: string;
  count: number;
};

export type TopAmbassador = {
  ambassadorId: string;
  name: string;
  schoolId: string | null;
  marketId: string | null;
  networkSize: number;
};

export type DailyMetric = {
  date: string;
  signups: number;
  active: number;
  participation: number;
  referrals: number;
  points: number;
};

export type ApiAnalytics = {
  filters: {
    from: string;
    to: string;
    schoolId: string | null;
    marketId: string | null;
    competitionId: string | null;
  };
  definitions: {
    activeUsers: string;
    participation: string;
  };
  overview: AnalyticsOverview;
  participation: {
    promptResponses: number;
    likes: number;
    comments: number;
    countedReferrals: number;
    uniqueUsers: number;
    totalEvents: number;
  };
  signupsBySchool: ScopeSignup[];
  signupsByMarket: ScopeSignup[];
  pointsByCategory: PointsByCategory[];
  referralsByStatus: StatusCount[];
  rewardsByStatus: StatusCount[];
  topAmbassadors: TopAmbassador[];
  dailyMetrics: DailyMetric[];
  reconciliation: {
    participationEventsMatch: boolean;
    pointsTotalMatches: boolean;
    referralTotalMatches: boolean;
    rewardTotalMatches: boolean;
    sourceCounts: Record<string, number>;
  };
};

function num(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildQuery(filters: AnalyticsFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.schoolId) params.set("schoolId", filters.schoolId);
  if (filters.marketId) params.set("marketId", filters.marketId);
  if (filters.competitionId) params.set("competitionId", filters.competitionId);
  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizeOverview(raw: RawRecord): AnalyticsOverview {
  return {
    totalUsers: num(raw.totalUsers),
    totalAmbassadors: num(raw.totalAmbassadors),
    newUsers: num(raw.newUsers),
    todaySignups: num(raw.todaySignups),
    nationalSignups: num(raw.nationalSignups),
    activeUsers: num(raw.activeUsers),
    participatingUsers: num(raw.participatingUsers),
    totalParticipationEvents: num(raw.totalParticipationEvents),
    totalReferrals: num(raw.totalReferrals),
    totalPointsEarned: num(raw.totalPointsEarned),
    totalPointEvents: num(raw.totalPointEvents),
    totalRewardRequests: num(raw.totalRewardRequests),
    totalRewardsUnlocked: num(raw.totalRewardsUnlocked),
    totalRewardsRedeemed: num(raw.totalRewardsRedeemed),
    totalAmbassadorNetwork: num(raw.totalAmbassadorNetwork),
  };
}

export async function getAnalytics(filters: AnalyticsFilters = {}): Promise<ApiAnalytics> {
  const payload = await call<RawRecord>(`/api/admin/analytics${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;

  return {
    filters: (root.filters as ApiAnalytics["filters"]) ?? {
      from: "",
      to: "",
      schoolId: null,
      marketId: null,
      competitionId: null,
    },
    definitions: (root.definitions as ApiAnalytics["definitions"]) ?? { activeUsers: "", participation: "" },
    overview: normalizeOverview((root.overview as RawRecord) ?? {}),
    participation: (root.participation as ApiAnalytics["participation"]) ?? {
      promptResponses: 0,
      likes: 0,
      comments: 0,
      countedReferrals: 0,
      uniqueUsers: 0,
      totalEvents: 0,
    },
    signupsBySchool: (root.signupsBySchool as ScopeSignup[]) ?? [],
    signupsByMarket: (root.signupsByMarket as ScopeSignup[]) ?? [],
    pointsByCategory: (root.pointsByCategory as PointsByCategory[]) ?? [],
    referralsByStatus: (root.referralsByStatus as StatusCount[]) ?? [],
    rewardsByStatus: (root.rewardsByStatus as StatusCount[]) ?? [],
    topAmbassadors: (root.topAmbassadors as TopAmbassador[]) ?? [],
    dailyMetrics: (root.dailyMetrics as DailyMetric[]) ?? [],
    reconciliation: (root.reconciliation as ApiAnalytics["reconciliation"]) ?? {
      participationEventsMatch: false,
      pointsTotalMatches: false,
      referralTotalMatches: false,
      rewardTotalMatches: false,
      sourceCounts: {},
    },
  };
}

export function analyticsExportUrl(filters: AnalyticsFilters = {}): string {
  return `/api/admin/analytics/export${buildQuery(filters)}`;
}
