import type { ListMarketsParams, MarketsListResponse, Market } from "@/lib/api/markets.types";
import type {
  ListSchoolsParams,
  SchoolsListResponse,
  School,
} from "@/lib/api/schools.types";

export type { Market, MarketsListResponse, ListMarketsParams };
export type { School, SchoolsListResponse, ListSchoolsParams };

export interface JoinWaitlistPayload {
  email: string;
  fullName: string;
  age: number;
  marketId: string;
  schoolId?: string;
  notInSchool?: boolean;
  referralCode?: string;
}

export interface JoinWaitlistApiResponse {
  user: ApiUser;
  magicLink?: string;
}

export interface JoinWaitlistResponse {
  message: string;
  waitlistPosition: number | null;
  referralCode: string;
  referralLink: string;
  magicLink?: string;
}

export interface WaitlistStatusResponse {
  onWaitlist: boolean;
  waitlistPosition: number | null;
  joinedAt: string;
  emailVerified: boolean;
  referralLink: string;
  school: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
  } | null;
  market: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
  } | null;
}

export interface WaitlistDashboardResponse {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    role: UserRole;
    waitlistPosition: number | null;
    referralCode: string;
    referralLink: string;
    joinedAt: string;
  };
  school: WaitlistStatusResponse["school"];
  market: WaitlistStatusResponse["market"];
  referrals: {
    directInvites: number;
  };
  competition: {
    id: string;
    title: string;
    status: string;
    startDate: string;
    endDate: string;
    gracePeriodEndDate: string | null;
    isExtended?: boolean;
    scoringOpen?: boolean;
  } | null;
}

export type UserRole = "NORMAL_USER" | "AMBASSADOR" | "ADMIN";

export interface ApiUser {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  schoolId: string | null;
  marketId: string | null;
  referralCode: string;
  waitlistPosition?: number | null;
  onboardingCompletedAt?: string | null;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface ApiErrorBody {
  message?: string | string[];
  statusCode?: number;
}

export interface MagicLinkRequestResponse {
  message?: string;
  magicLink?: string;
}

export interface VerifyMagicLinkResponse {
  token: string;
  user: ApiUser;
}

export interface MeResponse {
  user: ApiUser;
}

export interface AmbassadorInviteValidation {
  email: string;
  expiresAt: string;
  alreadyRegistered: boolean;
}

export interface ResendInviteResponse {
  email: string;
  expiresAt: string;
}

export interface CheckEmailResponse {
  email: string;
  registered: boolean;
}

export interface CompleteOnboardingPayload {
  token: string;
  fullName: string;
  schoolId: string;
  marketId: string;
  graduationYear?: number;
  instagram?: string;
}

export interface CompleteOnboardingResponse {
  token: string;
  referralLink: string;
  user: ApiUser;
}

export type LeaderboardScope = "campus" | "market" | "national" | "participation";
export type RankMovementDirection = "UP" | "DOWN" | "SAME" | "NEW";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  school: string | null;
  market: string | null;
  invitePoints: number;
  promptPoints: number;
  participationPoints: number;
  totalPoints: number;
  rankMovement: number;
  previousRank?: number | null;
  rankMovementDirection?: RankMovementDirection;
  rankMovementLabel?: string;
}

export interface MyLeaderboardResponse {
  meta: {
    scopeName: string | null;
    scopeLabel: string | null;
    competition: {
      id: string;
      title: string;
      startDate?: string;
      endDate: string;
      gracePeriodEndDate?: string | null;
      status: string;
      isExtended?: boolean;
      scoringOpen?: boolean;
    } | null;
    totalParticipants: number;
    userRank: number | null;
    previousRank?: number | null;
    rankMovement?: number;
    rankMovementDirection?: RankMovementDirection;
    totalPoints: number;
    breakdown: {
      invitePoints: number;
      promptPoints: number;
      participationPoints: number;
    };
    rankBasis?: "total" | "participation";
  };
  leaderboard: LeaderboardEntry[];
}
