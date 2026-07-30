export type AmbassadorRankMovementDirection = "UP" | "DOWN" | "SAME" | "NEW";

export type AmbassadorCompetition = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  gracePeriodEndDate: string | null;
  status: string;
  scoringOpen?: boolean;
} | null;

export type AmbassadorOverview = {
  directInvites: number;
  totalReferralNetwork: number;
  completedSignups: number;
  pendingReferrals: number;
  rank: number | null;
  previousRank: number | null;
  rankMovement: number;
  rankMovementDirection: AmbassadorRankMovementDirection;
  rankMovementLabel: string;
  prizeProgress: {
    total: number;
    unlocked: number;
  };
};

export type AmbassadorNetworkNode = {
  id: string;
  fullName: string;
  maskedEmail: string | null;
  referralDepth: number;
  referredByUserId: string;
  referrerName: string;
  status: "PENDING" | "COUNTED" | "REJECTED";
  isPending: boolean;
  isCompleted: boolean;
  joinedAt: string;
  countedAt: string | null;
};

export type AmbassadorReferralNetwork = {
  directReferrals: AmbassadorNetworkNode[];
  downstreamNetwork: AmbassadorNetworkNode[];
  depthTotals: Array<{
    depth: number;
    total: number;
    completed: number;
    pending: number;
  }>;
  totals: {
    direct: number;
    directCompleted: number;
    directPending: number;
    total: number;
    completed: number;
    pending: number;
  };
};

export type AmbassadorLeaderboardEntry = {
  rank: number;
  previousRank: number | null;
  rankMovement: number;
  rankMovementDirection: AmbassadorRankMovementDirection;
  rankMovementLabel: string;
  userId: string;
  fullName: string;
  school: string | null;
  market: string | null;
  directInvites: number;
  totalReferralNetwork: number;
  waitlistSignups: number;
  acceptedReferrals: number;
  pendingReferrals: number;
  conversionRate: number | null;
  conversionRateAvailable: boolean;
  campusRank: number | null;
  marketRank: number | null;
  nationalAmbassadorRank: number;
  appDownloads: number;
  appDownloadsEnabled: boolean;
};

export type AmbassadorPrize = {
  id: string;
  title: string;
  description: string | null;
  rewardType: string;
  unlockType: string;
  audienceType?: string;
  requiredInvites: number;
  requiredRank: number | null;
  quantity: number | null;
  status: string;
  unlockStatus: string;
  progress: {
    completedSignups: {
      current: number;
      required: number;
      percent: number;
    };
    rank: {
      current: number | null;
      required: number | null;
      percent: number;
    };
  };
};

export type AmbassadorCalendarEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
};

export type AmbassadorRules = {
  title: string;
  sections: string[];
  content: string;
};

export type AmbassadorDashboardResponse = {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    role: "AMBASSADOR";
    referralCode: string;
    referralLink: string;
    joinedAt: string;
  };
  school: { id: string; name: string } | null;
  market: { id: string; name: string } | null;
  competition: AmbassadorCompetition;
  overview: AmbassadorOverview;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    fullName: string;
    maskedEmail: string | null;
    status: string;
    referralDepth: number;
    createdAt: string;
  }>;
  myRank: number | null;
  leaderboard: AmbassadorLeaderboardEntry[];
  referralNetwork: AmbassadorReferralNetwork;
  prizes: AmbassadorPrize[];
  calendar: AmbassadorCalendarEvent[];
  rulesAndTerms: AmbassadorRules;
};
