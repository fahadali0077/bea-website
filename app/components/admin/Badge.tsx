import {
  ENTITY_STATUS_LABELS,
  INVITE_STATUS_LABELS,
  PROMPT_STATUS_LABELS,
  REDEMPTION_STATUS_LABELS,
  ROLE_LABELS,
  STATUS_LABELS,
  type EntityStatus,
  type InviteStatus,
  type PromptStatus,
  type RedemptionStatus,
  type UserRole,
  type UserStatus,
} from "@/lib/admin/types";

export function Badge({
  tone,
  children,
}: {
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-lato font-bold whitespace-nowrap ${tone}`}
    >
      {children}
    </span>
  );
}

const ROLE_TONE: Record<UserRole, string> = {
  ambassador: "bg-[#f3ece2] text-[#8a6a3f]",
  normal_user: "bg-neutral-100 text-neutral-600",
  admin: "bg-neutral-800 text-white",
};

const STATUS_TONE: Record<UserStatus, string> = {
  active: "bg-[#e7f0ea] text-[#3d7a6e]",
  pending: "bg-[#f7efe0] text-[#b0843a]",
  invited: "bg-[#eceef2] text-[#5b6b7d]",
  suspended: "bg-[#faf0eb] text-[#b0453a]",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge tone={ROLE_TONE[role]}>{ROLE_LABELS[role]}</Badge>;
}

export function StatusBadge({ status }: { status: UserStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>;
}

const INVITE_TONE: Record<InviteStatus, string> = {
  pending: "bg-[#f7efe0] text-[#b0843a]",
  accepted: "bg-[#e7f0ea] text-[#3d7a6e]",
  expired: "bg-neutral-100 text-neutral-500",
  revoked: "bg-[#faf0eb] text-[#b0453a]",
};

export function InviteStatusBadge({ status }: { status: InviteStatus }) {
  return <Badge tone={INVITE_TONE[status]}>{INVITE_STATUS_LABELS[status]}</Badge>;
}

const ENTITY_TONE: Record<EntityStatus, string> = {
  active: "bg-[#e7f0ea] text-[#3d7a6e]",
  inactive: "bg-neutral-100 text-neutral-500",
};

export function EntityStatusBadge({ status }: { status: EntityStatus }) {
  return <Badge tone={ENTITY_TONE[status]}>{ENTITY_STATUS_LABELS[status]}</Badge>;
}

const PROMPT_TONE: Record<PromptStatus, string> = {
  scheduled: "bg-[#eceef2] text-[#5b6b7d]",
  active: "bg-[#e7f0ea] text-[#3d7a6e]",
  closed: "bg-[#f7efe0] text-[#b0843a]",
  archived: "bg-neutral-100 text-neutral-500",
};

export function PromptStatusBadge({ status }: { status: PromptStatus }) {
  return <Badge tone={PROMPT_TONE[status]}>{PROMPT_STATUS_LABELS[status]}</Badge>;
}

const REDEMPTION_TONE: Record<RedemptionStatus, string> = {
  requested: "bg-[#f7efe0] text-[#b0843a]",
  approved: "bg-[#eceef2] text-[#5b6b7d]",
  rejected: "bg-[#faf0eb] text-[#b0453a]",
  redeemed: "bg-[#e7f0ea] text-[#3d7a6e]",
  expired: "bg-neutral-100 text-neutral-500",
};

export function RedemptionStatusBadge({ status }: { status: RedemptionStatus }) {
  return <Badge tone={REDEMPTION_TONE[status]}>{REDEMPTION_STATUS_LABELS[status]}</Badge>;
}
