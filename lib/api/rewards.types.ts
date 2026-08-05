export interface RewardCondition {
  key: string;
  label: string;
  current: number | null;
  required: number;
  met: boolean;
  enabled: boolean;
  autoUnlockable: boolean;
  percent: number;
}

export interface RewardInventory {
  quantity: number | null;
  reserved: number;
  redeemed: number;
  available: number | null;
  limited: boolean;
  outOfStock: boolean;
}

export type RewardUnlockStatus =
  | 'LOCKED'
  | 'UNLOCKED'
  | 'OUT_OF_STOCK'
  | 'UNAVAILABLE'
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'REDEEMED'
  | 'EXPIRED';

export interface RewardProgress {
  rewardId: string;
  title: string;
  description: string | null;
  rewardType: string;
  unlockType: string;
  audienceType: string;
  ruleOperator: 'ALL' | 'ANY';
  requiredPoints: number | null;
  requiredInvites: number | null;
  requiredRank: number | null;
  requiredAppDownloads: number | null;
  inventory: RewardInventory;
  conditions: RewardCondition[];
  unlockStatus: RewardUnlockStatus;
  eligible: boolean;
  redemptionLimitReached: boolean;
}

export interface MyRewardProgressResponse {
  totalPoints: number;
  totalInvites: number;
  appDownloads: number;
  ranks: {
    nationalRank: number | null;
    schoolRank: number | null;
    marketRank: number | null;
    ambassadorRank: number | null;
  };
  rewardsProgress: RewardProgress[];
}

export interface RedeemRewardResponse {
  id: string;
  rewardId: string;
  userId: string;
  status: string;
}
