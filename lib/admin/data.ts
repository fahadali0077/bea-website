import usersData from "@/config/admin/users.json";
import schoolsData from "@/config/admin/schools.json";
import marketsData from "@/config/admin/markets.json";
import invitesData from "@/config/admin/ambassador-invites.json";
import promptsData from "@/config/admin/prompts.json";
import promptResponsesData from "@/config/admin/prompt-responses.json";
import pointsRulesData from "@/config/admin/points-rules.json";
import pointsLedgerData from "@/config/admin/points-ledger.json";
import rewardsData from "@/config/admin/rewards.json";
import rewardRedemptionsData from "@/config/admin/reward-redemptions.json";
import adminMessagesData from "@/config/admin/admin-messages.json";
import type {
  AdminMessage,
  AdminUser,
  AmbassadorInvite,
  Market,
  PointsLedgerEntry,
  PointsRules,
  Prompt,
  PromptResponse,
  Reward,
  RewardRedemption,
  School,
} from "@/lib/admin/types";

export const adminUsers = usersData as AdminUser[];
export const schools = schoolsData as School[];
export const markets = marketsData as Market[];
export const ambassadorInvites = invitesData as AmbassadorInvite[];
export const prompts = promptsData as Prompt[];
export const promptResponses = promptResponsesData as PromptResponse[];
export const pointsRules = pointsRulesData as PointsRules;
export const pointsLedger = pointsLedgerData as PointsLedgerEntry[];
export const rewards = rewardsData as Reward[];
export const rewardRedemptions = rewardRedemptionsData as RewardRedemption[];
export const adminMessages = adminMessagesData as AdminMessage[];

export const ambassadors = adminUsers.filter((u) => u.role === "ambassador");

const userById = new Map(adminUsers.map((u) => [u.id, u]));
const schoolById = new Map(schools.map((s) => [s.id, s]));
const marketById = new Map(markets.map((m) => [m.id, m]));

export function getUser(id: string): AdminUser | undefined {
  return userById.get(id);
}

export function getRewardTitle(id: string): string {
  return rewards.find((r) => r.id === id)?.title ?? "—";
}

export function getUserName(id: string | null): string | null {
  return id ? userById.get(id)?.full_name ?? null : null;
}

export function getSchoolName(id: string | null): string {
  return id ? schoolById.get(id)?.name ?? "—" : "—";
}

export function getMarketName(id: string | null): string {
  return id ? marketById.get(id)?.name ?? "—" : "—";
}

export function getResponsesByPrompt(promptId: string): PromptResponse[] {
  return promptResponses
    .filter((r) => r.prompt_id === promptId)
    .sort((a, b) => b.likes_count - a.likes_count);
}

export function getUsersBySchool(schoolId: string): AdminUser[] {
  return adminUsers
    .filter((u) => u.school_id === schoolId)
    .sort((a, b) => b.points - a.points);
}

export function getUsersByMarket(marketId: string): AdminUser[] {
  return adminUsers
    .filter((u) => u.market_id === marketId)
    .sort((a, b) => b.points - a.points);
}

export type ReferralTreeNode = { user: AdminUser; children: ReferralTreeNode[] };

export function getReferralTree(ambassadorId: string): ReferralTreeNode[] {
  const network = adminUsers.filter((u) => u.root_ambassador_id === ambassadorId);
  const byParent = new Map<string, AdminUser[]>();

  for (const user of network) {
    const parentId = user.referred_by_user_id ?? ambassadorId;
    const siblings = byParent.get(parentId) ?? [];
    siblings.push(user);
    byParent.set(parentId, siblings);
  }

  const build = (parentId: string): ReferralTreeNode[] =>
    (byParent.get(parentId) ?? []).map((user) => ({ user, children: build(user.id) }));

  return build(ambassadorId);
}

export const schoolOptions = [...schools]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((s) => ({ id: s.id, name: s.name }));

export const marketOptions = [...markets]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((m) => ({ id: m.id, name: m.name }));
