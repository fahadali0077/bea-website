"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, GraduationCap, MapPin, TrendingUp, Trophy } from "lucide-react";

import { Avatar } from "@/app/components/dashboard/Avatar";
import InviteShareChannels from "@/app/components/dashboard/InviteShareChannels";
import {
  useGetAmbassadorDashboardQuery,
  useGetAmbassadorLeaderboardQuery,
  useGetAmbassadorReferralsQuery,
} from "@/features/api/apiSlice";
import {
  behindLeader,
  directInvitesOf,
  formatCount,
  impactDelta,
  impactOf,
  networkInvitesOf,
  relativeJoined,
  scopeLeaderboard,
} from "@/lib/ambassador-metrics";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { AmbassadorGuard, DashboardNotice } from "./_components";
import { CountdownText, Eyebrow, SurfaceCard, TEAL } from "./_ui";

export default function AmbassadorOverviewPage() {
  const { data, isLoading, error } = useGetAmbassadorDashboardQuery();
  const { data: rows = [] } = useGetAmbassadorLeaderboardQuery();
  const { data: network } = useGetAmbassadorReferralsQuery();

  const viewer = useMemo(
    () => ({
      schoolId: data?.school?.id ?? null,
      marketId: data?.market?.id ?? null,
      school: data?.school?.name ?? null,
      market: data?.market?.name ?? null,
    }),
    [data?.school?.id, data?.market?.id, data?.school?.name, data?.market?.name],
  );
  const userId = data?.user.id;

  const boards = useMemo(
    () => ({
      campus: scopeLeaderboard(rows, "campus", viewer),
      market: scopeLeaderboard(rows, "market", viewer),
      national: scopeLeaderboard(rows, "national", viewer),
    }),
    [rows, viewer],
  );

  const myRow = boards.national.find((row) => row.userId === userId);
  const delta = useMemo(() => impactDelta(network), [network]);

  const direct = myRow ? directInvitesOf(myRow) : (data?.overview.directInvites ?? 0);
  const indirect = myRow
    ? networkInvitesOf(myRow)
    : Math.max(0, (data?.overview.totalReferralNetwork ?? 0) - (data?.overview.directInvites ?? 0));
  const impact = myRow ? impactOf(myRow) : (data?.overview.totalReferralNetwork ?? 0);

  const firstName = (data?.user.fullName ?? "").trim().split(/\s+/)[0];

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-5 md:gap-6 min-w-0">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <h1 className="font-canela text-[30px] md:text-[46px] leading-tight tracking-[0.01em] text-black">
              Welcome{firstName ? `, ${firstName}` : ""}.
            </h1>
            <p className="mt-2 max-w-[420px] font-lato text-[15px] md:text-[17px] font-medium leading-relaxed text-[#7c7c7c]">
              You&rsquo;re officially in. Start sharing your link, grow your network, and climb the leaderboard.
            </p>
          </div>

          <SurfaceCard tone="cream" className="flex items-center gap-4 px-6 py-5">
            <span className="grid size-[46px] shrink-0 place-items-center rounded-full bg-white/70">
              <Trophy className="size-5.5" style={{ color: TEAL }} />
            </span>
            <span>
              <Eyebrow>Competition ends in</Eyebrow>
              <CountdownText
                endDate={data?.competition?.endDate}
                withSeconds
                className="mt-1 block font-canela text-[24px] md:text-[28px] leading-none"
              />
            </span>
          </SurfaceCard>
        </div>

        {isLoading ? <DashboardNotice>Loading your overview…</DashboardNotice> : null}
        {error ? <DashboardNotice>Your ambassador overview is unavailable right now.</DashboardNotice> : null}

        <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
          <SurfaceCard tone="cream" className="px-6 py-6">
            <Eyebrow>Your progress</Eyebrow>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Sparkle />
              <p className="font-canela text-[42px] md:text-[50px] leading-none" style={{ color: TEAL }}>
                {formatCount(impact)}
              </p>
              <Sparkle flipped />
            </div>
            <p className="mt-2 text-center font-lato text-[14px] font-bold text-[#4a4741]">Total Impact</p>

            <div className="mt-6 grid grid-cols-2 divide-x divide-[#e8e4dd]">
              <ProgressSplit
                value={direct}
                label="Personal Invites"
                description={"People who joined\nusing your link"}
              />
              <ProgressSplit
                value={indirect}
                label="Network Invites"
                description={"People who joined\nthrough your invites"}
              />
            </div>
          </SurfaceCard>

          <SurfaceCard tone="cream" className="px-6 py-6">
            <p className="font-lato text-[11px] md:text-[12px] font-bold uppercase tracking-[0.14em] text-[#a9743f]">
              Your ambassador link
            </p>
            <ReferralLinkRow link={data?.user.referralLink ?? ""} />

            <div className="mt-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#e8e4dd]" />
              <Eyebrow className="whitespace-nowrap">Share your link</Eyebrow>
              <span className="h-px flex-1 bg-[#e8e4dd]" />
            </div>

            <div className="mt-5">
              {data?.user.referralLink ? (
                <InviteShareChannels shareUrl={data.user.referralLink} />
              ) : (
                <p className="text-center font-lato text-[13px] font-medium text-[#7c7c7c]">
                  Your link appears once your ambassador profile is active.
                </p>
              )}
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard tone="cream" className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
          <RankStat
            icon={<TrendingUp className="size-5" />}
            tone="#e6eeee"
            label="Your impact"
            value={formatCount(impact)}
            note={`+${formatCount(delta.total)} today`}
          />
          <RankStat
            icon={<GraduationCap className="size-5" />}
            tone="#fdeedc"
            label="Campus rank"
            value={rankLabel(boards.campus, userId)}
            note={behindNote(boards.campus, userId)}
          />
          <RankStat
            icon={<MapPin className="size-5" />}
            tone="#eaeee1"
            label="Market rank"
            value={rankLabel(boards.market, userId)}
            note={behindNote(boards.market, userId)}
          />
          <RankStat
            icon={<Trophy className="size-5" />}
            tone="#ede7ef"
            label="National rank"
            value={rankLabel(boards.national, userId)}
            note={behindNote(boards.national, userId)}
          />
        </SurfaceCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <SurfaceCard tone="cream" className="px-6 py-6">
            <h2 className="font-canela text-[22px] md:text-[24px] text-black">Campus Leaderboard</h2>

            <div className="mt-4">
              {boards.campus.length ? (
                boards.campus.slice(0, 5).map((row) => {
                  const isMe = row.userId === userId;
                  return (
                    <div
                      key={row.userId}
                      className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-[#e8e4dd] py-3.5 last:border-b-0"
                    >
                      <span className="font-lato text-[15px] font-medium text-[#4a4741]">{row.rank}</span>
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar name={row.fullName} size={34} />
                        <span
                          className={`truncate font-lato text-[15px] ${isMe ? "font-black text-black" : "font-medium text-[#3f3b36]"}`}
                        >
                          {row.fullName}
                          {isMe ? " (You)" : ""}
                        </span>
                      </span>
                      <span className="font-lato text-[15px] font-medium text-black">
                        {formatCount(impactOf(row))}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="py-4 font-lato text-[14px] font-medium text-[#7c7c7c]">
                  Your campus board fills in as ambassadors start inviting.
                </p>
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard tone="cream" className="flex flex-col px-6 py-6">
            <h2 className="font-canela text-[22px] md:text-[24px] text-black">Recent Activity</h2>

            <div className="mt-4 flex-1">
              {data?.recentActivity.length ? (
                data.recentActivity.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-4 border-b border-[#e8e4dd] py-3.5 last:border-b-0"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <TrendingUp className="size-4 shrink-0" style={{ color: "#3d8a5a" }} />
                      <span className="truncate font-lato text-[15px] font-medium text-[#3f3b36]">
                        {activity.fullName}
                      </span>
                    </span>
                    <span className="shrink-0 font-lato text-[13px] font-medium text-[#9a948d]">
                      {relativeJoined(activity.createdAt).replace("Joined ", "")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-4 font-lato text-[14px] font-medium text-[#7c7c7c]">
                  Nothing yet. Share your link to get your first invite.
                </p>
              )}
            </div>

            <Link
              href="/dashboard/ambassador/impact"
              className="mt-5 block text-center font-lato text-[14px] font-bold underline-offset-4 hover:underline"
              style={{ color: TEAL }}
            >
              View all activity
            </Link>
          </SurfaceCard>
        </div>
      </main>
    </AmbassadorGuard>
  );
}

function rankLabel(rows: ReturnType<typeof scopeLeaderboard>, userId: string | undefined) {
  const me = rows.find((row) => row.userId === userId);
  return me ? `#${me.rank}` : "—";
}

function behindNote(rows: ReturnType<typeof scopeLeaderboard>, userId: string | undefined) {
  const gap = behindLeader(rows, userId);
  if (gap === null) return rows.some((row) => row.userId === userId) ? "Leading this board" : undefined;
  return `${formatCount(gap)} invites behind 1st`;
}

function ProgressSplit({
  value,
  label,
  description,
}: {
  value: number;
  label: string;
  description: string;
}) {
  return (
    <div className="px-3 text-center">
      <p className="font-canela text-[26px] md:text-[30px] leading-none" style={{ color: TEAL }}>
        {formatCount(value)}
      </p>
      <p className="mt-2 font-lato text-[13px] font-bold text-[#4a4741]">{label}</p>
      <p className="mt-1 whitespace-pre-line font-lato text-[12px] font-medium leading-snug text-[#9a948d]">
        {description}
      </p>
    </div>
  );
}

function RankStat({
  icon,
  tone,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span
        className="grid size-[42px] shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: tone, color: "#3f3b36" }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <p className="font-lato text-[11px] font-bold uppercase tracking-[0.14em] text-[#6f6a63]">{label}</p>
        <p className="mt-0.5 font-canela text-[24px] leading-none" style={{ color: TEAL }}>
          {value}
        </p>
        {note ? <p className="mt-1 font-lato text-[12px] font-medium text-[#9a948d]">{note}</p> : null}
      </span>
    </div>
  );
}

function ReferralLinkRow({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const display = link.replace(/^https?:\/\//, "") || "Link pending";

  const handleCopy = async () => {
    if (!link) return;
    const ok = await copyToClipboard(link);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 flex items-end justify-between gap-4 border-b border-[#e8e4dd] pb-3">
      <p className="min-w-0 truncate font-canela text-[22px] md:text-[27px] leading-tight text-black">{display}</p>
      <button
        type="button"
        onClick={() => void handleCopy()}
        disabled={!link}
        aria-label="Copy your ambassador link"
        className="shrink-0 cursor-pointer rounded-[6px] p-1.5 text-[#4a4741] transition-colors hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4c56]/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Copy className="size-5" />
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}

/** The two flicks either side of the total on the progress card. */
function Sparkle({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      width="18"
      height="26"
      viewBox="0 0 18 26"
      fill="none"
      aria-hidden="true"
      className={flipped ? "scale-x-[-1]" : ""}
    >
      <path d="M15 3L4 8" stroke="#f0b429" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M15 13H3" stroke="#f0b429" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M15 23L4 18" stroke="#f0b429" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
