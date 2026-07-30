export { getApiErrorMessage, persistAccessToken, readAccessToken } from "@/lib/api/axios-client";

export type {
  ApiUser,
  ApiErrorBody,
  UserRole,
  JoinWaitlistPayload,
  JoinWaitlistApiResponse,
  JoinWaitlistResponse,
  MagicLinkRequestResponse,
  MeResponse,
  VerifyMagicLinkResponse,
  WaitlistDashboardResponse,
  WaitlistStatusResponse,
  AmbassadorInviteValidation,
  CompleteOnboardingPayload,
  CompleteOnboardingResponse,
} from "@/lib/api/types";
export type { Market, MarketsListResponse, ListMarketsParams } from "@/lib/api/markets.types";
export type { School, SchoolsListResponse, ListSchoolsParams } from "@/lib/api/schools.types";
