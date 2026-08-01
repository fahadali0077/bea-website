export type CompetitionStatus = "UPCOMING" | "ACTIVE" | "GRACE_PERIOD" | "ENDED" | "ARCHIVED";

export type LifecycleCompetition = {
  title?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  gracePeriodEndDate?: string | null;
  isExtended?: boolean | null;
  scoringOpen?: boolean | null;
} | null | undefined;

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeStatus = (status?: string | null): CompetitionStatus | "NONE" => {
  const value = (status ?? "NONE").toUpperCase();
  if (["UPCOMING", "ACTIVE", "GRACE_PERIOD", "ENDED", "ARCHIVED"].includes(value)) {
    return value as CompetitionStatus;
  }
  return "NONE";
};

const formatRemaining = (target?: string | null) => {
  if (!target) return "";
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return "";
  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return "<1h";
};

const TOTAL_DAYS = 7;

export function getCompetitionLifecycle(competition: LifecycleCompetition) {
  const status = normalizeStatus(competition?.status);
  const scoringOpen = Boolean(competition?.scoringOpen) || status === "ACTIVE";
  const start = competition?.startDate ? new Date(competition.startDate).getTime() : null;
  const end = competition?.endDate ? new Date(competition.endDate).getTime() : null;
  const now = Date.now();
  const dayNumber = start && end && now >= start && now < end
    ? Math.min(TOTAL_DAYS, Math.max(1, Math.floor((now - start) / DAY_MS) + 1))
    : null;

  if (status === "ACTIVE") {
    return {
      status,
      scoringOpen,
      dayNumber,
      totalDays: TOTAL_DAYS,
      label: dayNumber ? `Day ${dayNumber} of ${TOTAL_DAYS}` : "Competition active",
      bannerTitle: "Competition is live",
      bannerBody: `Scoring is open${competition?.endDate ? ` for ${formatRemaining(competition.endDate)}` : ""}. Prompt, invite, like, and comment points count right now.`,
      tone: "active" as const,
      promptCtaEnabled: true,
    };
  }

  if (status === "UPCOMING") {
    return {
      status,
      scoringOpen: false,
      dayNumber: null,
      totalDays: TOTAL_DAYS,
      label: "Competition upcoming",
      bannerTitle: "Competition starts soon",
      bannerBody: competition?.startDate
        ? `Scoring opens in ${formatRemaining(competition.startDate)}.`
        : "Scoring has not opened yet.",
      tone: "upcoming" as const,
      promptCtaEnabled: false,
    };
  }

  if (status === "GRACE_PERIOD") {
    return {
      status,
      scoringOpen: false,
      dayNumber: null,
      totalDays: TOTAL_DAYS,
      label: "Grace period",
      bannerTitle: "Competition ended",
      bannerBody: `Leaderboards are locked. No new points are awarded during grace${competition?.gracePeriodEndDate ? `, which ends in ${formatRemaining(competition.gracePeriodEndDate)}` : ""}.`,
      tone: "grace" as const,
      promptCtaEnabled: false,
    };
  }

  return {
    status,
    scoringOpen: false,
    dayNumber: null,
    totalDays: TOTAL_DAYS,
    label: "Scoring closed",
    bannerTitle: status === "ARCHIVED" ? "Competition archived" : "No active competition",
    bannerBody: "Scoring is closed. There is no active daily prompt right now.",
    tone: "closed" as const,
    promptCtaEnabled: false,
  };
}