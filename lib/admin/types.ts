export type UserRole = "normal_user" | "ambassador" | "admin";

export type UserStatus = "active" | "pending" | "invited" | "suspended";

export type EntityStatus = "active" | "inactive";

export type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  school_id: string | null;
  market_id: string | null;
  referral_code: string;
  referred_by_user_id: string | null;
  root_ambassador_id: string | null;
  referral_depth: number;
  direct_invites: number;
  total_network: number;
  points: number;
  waitlist_position: number;
  last_login_at: string | null;
  created_at: string;
};

export type School = {
  id: string;
  name: string;
  city: string;
  state: string;
  market_id: string;
  image_url: string;
  participant_count: number;
  status: EntityStatus;
  created_at: string;
};

export type Market = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  unlock_target: number;
  participant_count: number;
  status: EntityStatus;
  created_at: string;
};

export type MessageTargetType = "all" | "ambassadors" | "school" | "market";

export type DeliveryChannel = "forum" | "email" | "both";

export type AdminMessage = {
  id: string;
  title: string;
  body: string;
  target_type: MessageTargetType;
  target_id: string | null;
  delivery_channel: DeliveryChannel;
  created_by_admin_id: string;
  sent_at: string;
  created_at: string;
};

export const DELIVERY_CHANNEL_LABELS: Record<DeliveryChannel, string> = {
  forum: "Forum",
  email: "Email",
  both: "Forum + Email",
};

export type RewardType =
  | "invite_based"
  | "points_based"
  | "campus_winner"
  | "market_winner"
  | "national_winner"
  | "ambassador";

export type UnlockType =
  | "invite_count"
  | "points_target"
  | "ranking_position"
  | "admin_defined"
  | "app_downloads";

export type RedemptionStatus = "requested" | "approved" | "rejected" | "redeemed" | "expired";

export type Reward = {
  id: string;
  title: string;
  description: string;
  reward_type: RewardType;
  unlock_type: UnlockType;
  required_points: number;
  required_invites: number;
  required_rank: number;
  quantity: number;
  status: EntityStatus;
  created_at: string;
};

export type RewardRedemption = {
  id: string;
  user_id: string;
  reward_id: string;
  status: RedemptionStatus;
  redeemed_at: string | null;
  created_at: string;
};

export const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  invite_based: "Invite-based",
  points_based: "Points-based",
  campus_winner: "Campus winner",
  market_winner: "Market winner",
  national_winner: "National winner",
  ambassador: "Ambassador",
};

export const UNLOCK_TYPE_LABELS: Record<UnlockType, string> = {
  invite_count: "Invite count",
  points_target: "Points target",
  ranking_position: "Ranking position",
  admin_defined: "Admin defined",
  app_downloads: "App downloads",
};

export const REDEMPTION_STATUS_LABELS: Record<RedemptionStatus, string> = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
  redeemed: "Redeemed",
  expired: "Expired",
};

export type PointCategory =
  | "invite"
  | "prompt"
  | "like"
  | "comment"
  | "winner_bonus"
  | "admin_adjustment";

export type PointScope = "campus" | "market" | "national";

export type PointsLedgerEntry = {
  id: string;
  user_id: string;
  competition_id: string;
  source_type: string;
  source_id: string;
  points: number;
  point_category: PointCategory;
  scope: PointScope;
  created_at: string;
};

export type WinnerTier = { first: number; second: number; third: number };

export type PointsRules = {
  actions: { invite: number; prompt: number; like: number; comment: number };
  winners: { campus: WinnerTier; market: WinnerTier; national: WinnerTier };
};

export const POINT_CATEGORY_LABELS: Record<PointCategory, string> = {
  invite: "Invite",
  prompt: "Prompt",
  like: "Like",
  comment: "Comment",
  winner_bonus: "Winner bonus",
  admin_adjustment: "Adjustment",
};

export const POINT_SCOPE_LABELS: Record<PointScope, string> = {
  campus: "Campus",
  market: "Market",
  national: "National",
};

export type PromptStatus = "scheduled" | "active" | "closed" | "archived";

export type Prompt = {
  id: string;
  competition_id: string;
  day: number;
  title: string;
  description: string;
  prompt_date: string;
  status: PromptStatus;
  created_by_admin_id: string;
  created_at: string;
};

export type PromptResponse = {
  id: string;
  prompt_id: string;
  user_id: string;
  school_id: string;
  market_id: string;
  response_text: string;
  likes_count: number;
  comments_count: number;
  winner_rank: number | null;
  created_at: string;
};

export type InviteStatus = "pending" | "accepted" | "expired" | "revoked";

export type AmbassadorInvite = {
  id: string;
  email: string;
  status: InviteStatus;
  invited_by_admin_id: string;
  invite_token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  normal_user: "Normal User",
  ambassador: "Ambassador",
  admin: "Admin",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  pending: "Pending",
  invited: "Invited",
  suspended: "Suspended",
};

export const ENTITY_STATUS_LABELS: Record<EntityStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const PROMPT_STATUS_LABELS: Record<PromptStatus, string> = {
  scheduled: "Scheduled",
  active: "Active",
  closed: "Closed",
  archived: "Archived",
};

export const INVITE_STATUS_LABELS: Record<InviteStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  expired: "Expired",
  revoked: "Revoked",
};
