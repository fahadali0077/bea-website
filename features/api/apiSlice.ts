import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "@/lib/api/rtk-base-query";
import type {
  AmbassadorInviteValidation,
  CheckEmailResponse,
  CompleteOnboardingPayload,
  CompleteOnboardingResponse,
  JoinWaitlistApiResponse,
  JoinWaitlistPayload,
  MagicLinkRequestResponse,
  MeResponse,
  LeaderboardScope,
  MyLeaderboardResponse,
  ResendInviteResponse,
  VerifyMagicLinkResponse,
  WaitlistDashboardResponse,
  WaitlistStatusResponse,
} from "@/lib/api/types";
import type { ListMarketsParams, MarketsListResponse, Market } from "@/lib/api/markets.types";
import type {
  MyRewardProgressResponse,
  RedeemRewardResponse,
} from "@/lib/api/rewards.types";
import type {
  ListSchoolsParams,
  SchoolsListResponse,
  School,
  SchoolRankingParams,
  SchoolRankingResponse,
} from "@/lib/api/schools.types";
import type {
  ShopCategory,
  ListProductsParams,
  ProductsListResponse,
} from "@/lib/api/shop.types";
import type {
  ListForumPostsParams,
  ListForumPostsResponse,
  ForumPost,
  CreateForumPostPayload,
  CreateForumPostResponse,
  LikeForumPostResponse,
  CommentForumPostPayload,
  CommentForumPostResponse,
} from "@/lib/api/forum.types";
import type {
  TodayPrompt,
  PromptsArchiveResponse,
  PromptResponsesResponse,
  GetPromptResponsesParams,
  SubmitPromptResponsePayload,
  SubmitPromptResponseResult,
  LikeResponsePayload,
  LikeResponseResult,
  CommentOnResponsePayload,
  CommentOnResponseResult,
  ResponseCommentsResponse,
} from "@/lib/api/prompts.types";
import type {
  AmbassadorCalendarEvent,
  AmbassadorDashboardResponse,
  AmbassadorLeaderboardEntry,
  AmbassadorReferralNetwork,
} from "@/lib/api/ambassador.types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Me", "WaitlistStatus", "WaitlistDashboard", "Leaderboard", "AmbassadorDashboard", "AmbassadorNetwork", "AmbassadorLeaderboard", "AmbassadorCalendar", "Schools", "SchoolRanking", "Markets", "RewardProgress", "Products", "Categories", "TodayPrompt", "PromptResponses", "ResponseComments", "PromptsArchive", "ForumPosts", "ForumPost"],
  endpoints: (builder) => ({
    requestMagicLink: builder.mutation<MagicLinkRequestResponse, string>({
      query: (email) => ({ url: "/auth/request-magic-link", method: "POST", data: { email } }),
    }),

    verifyMagicLink: builder.mutation<VerifyMagicLinkResponse, string>({
      query: (token) => ({ url: "/auth/verify-magic-link", method: "GET", params: { token } }),
      invalidatesTags: ["Me", "WaitlistDashboard", "WaitlistStatus"],
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
      providesTags: ["Me"],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Me", "WaitlistDashboard", "WaitlistStatus"],
    }),

    joinWaitlist: builder.mutation<JoinWaitlistApiResponse, JoinWaitlistPayload>({
      query: (payload) => ({ url: "/waitlist/join", method: "POST", data: payload }),
      invalidatesTags: ["WaitlistStatus", "WaitlistDashboard"],
    }),

    getWaitlistStatus: builder.query<WaitlistStatusResponse, void>({
      query: () => ({ url: "/waitlist/status", method: "GET" }),
      providesTags: ["WaitlistStatus"],
    }),

    getWaitlistDashboard: builder.query<WaitlistDashboardResponse, void>({
      query: () => ({ url: "/waitlist/dashboard", method: "GET" }),
      providesTags: ["WaitlistDashboard"],
    }),

    getMyLeaderboard: builder.query<MyLeaderboardResponse, LeaderboardScope>({
      query: (scope) => ({ url: "/leaderboards/me", method: "GET", params: { scope } }),
      providesTags: ["Leaderboard"],
    }),

    listSchools: builder.query<SchoolsListResponse, ListSchoolsParams | void>({
      query: (params) => ({ url: "/schools", method: "GET", params: params ?? undefined }),
      providesTags: ["Schools"],
    }),

    getMyRewardProgress: builder.query<MyRewardProgressResponse, void>({
      query: () => ({ url: "/rewards/my-progress", method: "GET" }),
      providesTags: ["RewardProgress"],
    }),

    redeemReward: builder.mutation<RedeemRewardResponse, string>({
      query: (rewardId) => ({ url: `/rewards/${rewardId}/redeem`, method: "POST" }),
      // Redeeming consumes inventory and changes unlock status, and the points
      // card reads from the same progress payload.
      invalidatesTags: ["RewardProgress", "Leaderboard"],
    }),

    getSchoolRanking: builder.query<SchoolRankingResponse, SchoolRankingParams | void>({
      query: (params) => ({ url: "/schools/ranking", method: "GET", params: params ?? undefined }),
      // Infinite-scroll cache: every page of the same filter set collapses into
      // one cache entry so the component reads a single growing list instead of
      // accumulating pages in local state.
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { search = "", marketId = "" } = queryArgs ?? {};
        return `${endpointName}(${search}:${marketId})`;
      },
      merge: (currentCache, incoming) => {
        currentCache.meta = incoming.meta;
        currentCache.pagination = incoming.pagination;

        // Page 1 means a fresh load or a filter change - replace, don't append.
        if (incoming.pagination.page <= 1) {
          currentCache.items = incoming.items;
          return;
        }

        const seen = new Set(currentCache.items.map((item) => item.schoolId));
        incoming.items.forEach((item) => {
          if (!seen.has(item.schoolId)) {
            currentCache.items.push(item);
          }
        });
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
      providesTags: ["SchoolRanking"],
    }),

    listMarkets: builder.query<MarketsListResponse, ListMarketsParams | void>({
      query: (params) => ({ url: "/markets", method: "GET", params: params ?? undefined }),
      providesTags: ["Markets"],
    }),

    listAllMarkets: builder.query<Market[], void>({
      query: () => ({ url: "/markets/all", method: "GET" }),
      providesTags: ["Markets"],
    }),

    listAllSchools: builder.query<School[], { marketId?: string } | void>({
      query: (params) => ({ url: "/schools/all", method: "GET", params: params ?? undefined }),
      providesTags: ["Schools"],
    }),

    listShopProducts: builder.query<ProductsListResponse, ListProductsParams | void>({
      query: (params) => ({ url: "/products", method: "GET", params: params ?? undefined }),
      providesTags: ["Products"],
    }),

    listShopCategories: builder.query<ShopCategory[], void>({
      query: () => ({ url: "/products/categories", method: "GET" }),
      providesTags: ["Categories"],
    }),

    validateAmbassadorOnboarding: builder.query<AmbassadorInviteValidation, string>({
      query: (token) => ({ url: "/ambassador/onboarding/validate", method: "GET", params: { token } }),
    }),

    checkAmbassadorEmail: builder.query<CheckEmailResponse, string>({
      query: (email) => ({ url: "/ambassador/onboarding/check-email", method: "GET", params: { email } }),
    }),

    resendAmbassadorInvite: builder.mutation<ResendInviteResponse, string>({
      query: (token) => ({ url: "/ambassador/onboarding/resend", method: "POST", data: { token } }),
    }),

    completeAmbassadorOnboarding: builder.mutation<CompleteOnboardingResponse, CompleteOnboardingPayload>({
      query: (payload) => ({ url: "/ambassador/onboarding/complete", method: "POST", data: payload }),
      invalidatesTags: ["Me", "WaitlistDashboard", "WaitlistStatus"],
    }),

    getAmbassadorDashboard: builder.query<AmbassadorDashboardResponse, void>({
      query: () => ({ url: "/ambassador/dashboard", method: "GET" }),
      providesTags: ["AmbassadorDashboard"],
    }),

    getAmbassadorReferrals: builder.query<AmbassadorReferralNetwork, void>({
      query: () => ({ url: "/ambassador/referrals", method: "GET" }),
      providesTags: ["AmbassadorNetwork"],
    }),

    getAmbassadorLeaderboard: builder.query<AmbassadorLeaderboardEntry[], void>({
      query: () => ({ url: "/ambassador/leaderboard", method: "GET" }),
      providesTags: ["AmbassadorLeaderboard"],
    }),

    getAmbassadorCalendar: builder.query<AmbassadorCalendarEvent[], void>({
      query: () => ({ url: "/ambassador/calendar", method: "GET" }),
      providesTags: ["AmbassadorCalendar"],
    }),

    getTodayPrompt: builder.query<TodayPrompt, void>({
      query: () => ({ url: "/prompts/today", method: "GET" }),
      providesTags: ["TodayPrompt"],
    }),

    getPromptsArchive: builder.query<PromptsArchiveResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/prompts/archive", method: "GET", params: params ?? undefined }),
      providesTags: ["PromptsArchive"],
    }),

    getPromptResponses: builder.query<PromptResponsesResponse, GetPromptResponsesParams>({
      query: ({ promptId, scope, page = 1, limit = 20 }) => ({
        url: `/prompts/${promptId}/responses`,
        method: "GET",
        params: { scope, page, limit },
      }),
      providesTags: (_result, _err, arg) => [{ type: "PromptResponses", id: `${arg.promptId}-${arg.scope ?? "national"}` }],
    }),

    getResponseComments: builder.query<ResponseCommentsResponse, { responseId: string; page?: number; limit?: number }>({
      query: ({ responseId, page = 1, limit = 20 }) => ({
        url: `/prompts/responses/${responseId}/comments`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (_result, _err, arg) => [{ type: "ResponseComments", id: arg.responseId }],
    }),

    submitPromptResponse: builder.mutation<SubmitPromptResponseResult, SubmitPromptResponsePayload>({
      query: ({ promptId, responseText }) => ({
        url: `/prompts/${promptId}/response`,
        method: "POST",
        data: { responseText },
      }),
      invalidatesTags: ["PromptResponses", "TodayPrompt", "Leaderboard", "WaitlistDashboard"],
    }),

    likeResponse: builder.mutation<LikeResponseResult, LikeResponsePayload>({
      query: ({ responseId }) => ({
        url: `/prompts/responses/${responseId}/like`,
        method: "POST",
      }),
    }),

    commentOnResponse: builder.mutation<CommentOnResponseResult, CommentOnResponsePayload>({
      query: ({ responseId, commentText }) => ({
        url: `/prompts/responses/${responseId}/comment`,
        method: "POST",
        data: { commentText },
      }),
      // Write the new comment straight into the cache so it appears instantly
      // with no refetch. The server returns the created row, so this is the
      // real record rather than an optimistic guess.
      async onQueryStarted({ responseId }, { dispatch, queryFulfilled }) {
        try {
          const { data: created } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData("getResponseComments", { responseId }, (draft) => {
              if (draft.items.some((item) => item.id === created.id)) return;
              draft.items.push(created);
              draft.pagination.total += 1;
            })
          );
        } catch {
          // The component surfaces the failure to the user.
        }
      },
      // Was the bare string "ResponseComments", which RTK reads as
      // { type, id: undefined } and never matches the id-scoped tag the query
      // provides — so the comment saved but the list never refreshed.
      invalidatesTags: (_result, _err, { responseId }) => [
        "PromptResponses",
        { type: "ResponseComments" as const, id: responseId },
      ],
    }),

    listForumPosts: builder.query<ListForumPostsResponse, ListForumPostsParams | void>({
      query: (params) => ({
        url: "/forum/posts",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["ForumPosts"],
    }),

    getForumPost: builder.query<ForumPost, string>({
      query: (id) => ({
        url: `/forum/posts/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "ForumPost", id }],
    }),

    createForumPost: builder.mutation<CreateForumPostResponse, CreateForumPostPayload>({
      query: (payload) => ({
        url: "/forum/posts",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["ForumPosts"],
    }),

    likeForumPost: builder.mutation<LikeForumPostResponse, string>({
      query: (id) => ({
        url: `/forum/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [{ type: "ForumPost", id }, "ForumPosts"],
    }),

    commentForumPost: builder.mutation<CommentForumPostResponse, CommentForumPostPayload>({
      query: ({ postId, commentText }) => ({
        url: `/forum/posts/${postId}/comments`,
        method: "POST",
        data: { commentText },
      }),
      invalidatesTags: (_result, _err, { postId }) => [{ type: "ForumPost", id: postId }, "ForumPosts"],
    }),
  }),
});

export const {
  useRequestMagicLinkMutation,
  useVerifyMagicLinkMutation,
  useGetMeQuery,
  useLogoutMutation,
  useJoinWaitlistMutation,
  useGetWaitlistStatusQuery,
  useGetWaitlistDashboardQuery,
  useGetMyLeaderboardQuery,
  useListSchoolsQuery,
  useGetSchoolRankingQuery,
  useGetMyRewardProgressQuery,
  useRedeemRewardMutation,
  useLazyListSchoolsQuery,
  useListMarketsQuery,
  useLazyListMarketsQuery,
  useListAllMarketsQuery,
  useLazyListAllMarketsQuery,
  useListAllSchoolsQuery,
  useLazyListAllSchoolsQuery,
  useListShopProductsQuery,
  useLazyListShopProductsQuery,
  useListShopCategoriesQuery,
  useLazyListShopCategoriesQuery,
  useValidateAmbassadorOnboardingQuery,
  useLazyCheckAmbassadorEmailQuery,
  useResendAmbassadorInviteMutation,
  useCompleteAmbassadorOnboardingMutation,
  useGetAmbassadorDashboardQuery,
  useGetAmbassadorReferralsQuery,
  useGetAmbassadorLeaderboardQuery,
  useGetAmbassadorCalendarQuery,
  useGetTodayPromptQuery,
  useGetPromptsArchiveQuery,
  useGetPromptResponsesQuery,
  useGetResponseCommentsQuery,
  useSubmitPromptResponseMutation,
  useLikeResponseMutation,
  useCommentOnResponseMutation,
  useListForumPostsQuery,
  useLazyListForumPostsQuery,
  useGetForumPostQuery,
  useLazyGetForumPostQuery,
  useCreateForumPostMutation,
  useLikeForumPostMutation,
  useCommentForumPostMutation,
} = apiSlice;