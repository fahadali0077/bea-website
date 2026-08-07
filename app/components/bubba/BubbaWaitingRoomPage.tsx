"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Dices,
  Gift,
  GraduationCap,
  Heart,
  MapPin,
  MessageSquare,
  Sun,
  Tag,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";

import { useListAllSchoolsQuery, useListMarketsQuery } from "@/features/api/apiSlice";
import { cityArt } from "@/lib/join";
import {
  BUBBA_WRP_CALENDAR,
  BUBBA_WRP_CAMPUS_PRIZE,
  BUBBA_WRP_CARDS,
  BUBBA_WRP_CLOSER,
  BUBBA_WRP_HERO,
  BUBBA_WRP_HOW_IT_WORKS,
  BUBBA_WRP_PRIZES,
  BUBBA_WRP_PROMO,
  BUBBA_WRP_SCHEDULE,
  type BubbaWrpDayType,
} from "@/lib/bubba-content";

import { BubbaShell } from "./BubbaShell";

const BENEFIT_ICONS = {
  prompts: MessageSquare,
  leaderboard: Trophy,
  prizes: Gift,
} as const;

const STAT_ICONS = {
  campuses: GraduationCap,
  ambassadors: Users,
  days: Sun,
} as const;

const DAY_TYPE_ICON: Record<BubbaWrpDayType, typeof MessageSquare> = {
  prompt: MessageSquare,
  game: Dices,
  snap: Camera,
  mystery: Sun,
};

const HOW_IT_WORKS_ICONS = {
  prompts: Sun,
  invite: UserPlus,
  points: Tag,
  redeem: Gift,
  launch: MapPin,
} as const;

/** Small rotating palette for the school-avatar badges in the market cards. */
const AVATAR_TONES = ["#c1443f", "#8a1f3a", "#2f50b3", "#8d8d8d"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function MarketCard({ marketId, name }: { marketId: string; name: string }) {
  const { data: schools } = useListAllSchoolsQuery({ marketId });
  const list = schools ?? [];
  const shown = list.slice(0, 3);
  const rest = list.length - shown.length;
  const art = cityArt(name);

  return (
    <div className="bb-wrp-market">
      <div className="bb-wrp-market-head">
        <div className="bb-wrp-market-art" aria-hidden="true">
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art} alt="" />
          ) : null}
        </div>
        <div className="bb-wrp-market-id">
          <p className="bb-wrp-market-name">{name}</p>
          <p className="bb-wrp-market-count">
            {list.length} participating school{list.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/calendar" className="bb-wrp-market-link">
          View schools
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      {shown.length ? (
        <ul className="bb-wrp-avatars">
          {shown.map((s, i) => (
            <li key={s.id} className="bb-wrp-avatar" style={{ background: AVATAR_TONES[i % AVATAR_TONES.length] }}>
              <span>{initials(s.name)}</span>
              <span className="bb-wrp-avatar-name">{s.name}</span>
            </li>
          ))}
          {rest > 0 ? (
            <li className="bb-wrp-avatar bb-wrp-avatar--more">
              <span>+{rest}</span>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

export function BubbaWaitingRoomPage() {
  const { data: marketsData } = useListMarketsQuery({ limit: 3 });
  const markets = marketsData?.items ?? [];

  return (
    <BubbaShell active="waiting-room" showCapture={false}>
      <div className="bb-shell bb-wrp">
        {/* ── Hero ── */}
        <section className="bb-wrp-hero">
          <div className="bb-wrp-hero-head">
            <h1 className="bb-wrp-hero-title">
              <span className="bb-wrp-hero-line bb-wrp-hero-line--gold">The</span>
              <span className="bb-wrp-hero-line bb-wrp-hero-line--green">Waiting</span>
              <span className="bb-wrp-hero-line bb-wrp-hero-line--blue">Room</span>
            </h1>
            <p className="bb-wrp-hero-kicker">{BUBBA_WRP_HERO.kicker}</p>
          </div>

          <div className="bb-wrp-hero-photo" aria-hidden="true">
            {BUBBA_WRP_HERO.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={BUBBA_WRP_HERO.photo} alt="" />
            ) : null}
          </div>

          <div className="bb-wrp-hero-copy">
            <p className="bb-wrp-hero-sub">{BUBBA_WRP_HERO.sub}</p>
            <p className="bb-wrp-hero-date">{BUBBA_WRP_HERO.dateRange}</p>
            <p className="bb-wrp-hero-tagline">
              <span>{BUBBA_WRP_HERO.tagline}</span>
            </p>
          </div>

          <ul className="bb-wrp-hero-benefits">
            {BUBBA_WRP_HERO.benefits.map((b) => {
              const Icon = BENEFIT_ICONS[b.key as keyof typeof BENEFIT_ICONS];
              return (
                <li key={b.key}>
                  <span className="bb-wrp-hero-benefit-icon" aria-hidden="true">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="bb-wrp-hero-benefit-label">{b.label}</span>
                </li>
              );
            })}
          </ul>

          <div className="bb-wrp-stats">
            {BUBBA_WRP_HERO.stats.map((s) => {
              const Icon = STAT_ICONS[s.key as keyof typeof STAT_ICONS];
              return (
                <div className="bb-wrp-stat" key={s.key}>
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  <span className="bb-wrp-stat-value">{s.value}</span>
                  <span className="bb-wrp-stat-label">{s.label}</span>
                </div>
              );
            })}
            <div className="bb-wrp-stat bb-wrp-stat--cta">
              <span>{BUBBA_WRP_HERO.statCta.label}</span>
            </div>
          </div>
        </section>

        {/* ── One daily promo ── */}
        <section className="bb-wrp-promo">
          <div className="bb-wrp-promo-copy">
            <p className="bb-eyebrow">{BUBBA_WRP_PROMO.kicker}</p>
            <h2 className="bb-wrp-promo-title">
              <span className="bb-wrp-promo-title-a">{BUBBA_WRP_PROMO.title[0]}</span>
              <span className="bb-wrp-promo-title-b">{BUBBA_WRP_PROMO.title[1]}</span>
            </h2>
            {BUBBA_WRP_PROMO.body.map((p) => (
              <p className="bb-wrp-promo-body" key={p}>
                {p}
              </p>
            ))}
          </div>

          <div className="bb-wrp-cards" aria-hidden="true">
            {BUBBA_WRP_CARDS.map((c) => (
              <div className={`bb-wrp-card bb-wrp-card--${c.id}`} key={c.id}>
                <p className={`bb-wrp-card-chip bb-wrp-card-chip--${c.tone}`}>{c.chip}</p>
                <p className="bb-wrp-card-title">{c.title}</p>
                {"art" in c ? (
                  c.art ? (
                    <div className="bb-wrp-card-art bb-wrp-card-art--photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.art} alt="" />
                    </div>
                  ) : (
                    <div className="bb-wrp-card-art" />
                  )
                ) : null}
                {"detail" in c && c.detail ? (
                  <p className="bb-wrp-card-detail">{c.detail}</p>
                ) : null}
                <div className="bb-wrp-card-foot">
                  <span className="bb-wrp-card-likes">
                    <Heart size={14} strokeWidth={1.8} />
                    {c.likes}
                  </span>
                  <span className="bb-wrp-card-action">
                    {c.action}
                    <ArrowRight size={13} strokeWidth={2} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7-day calendar strip ── */}
        <section className="bb-wrp-calendar">
          <div className="bb-wrp-calendar-head">
            <p className="bb-eyebrow">{BUBBA_WRP_CALENDAR.kicker}</p>
            <h2 className="bb-wrp-calendar-title">{BUBBA_WRP_CALENDAR.title}</h2>
            <p className="bb-wrp-calendar-body">{BUBBA_WRP_CALENDAR.body}</p>
          </div>

          <ul className="bb-wrp-days">
            {BUBBA_WRP_SCHEDULE.map((d) => {
              const Icon = DAY_TYPE_ICON[d.type];
              return (
                <li className="bb-wrp-day" key={d.day}>
                  <p className="bb-wrp-day-name">{d.day}</p>
                  <p className="bb-wrp-day-date">{d.date}</p>
                  <span className={`bb-wrp-day-icon bb-wrp-day-icon--${d.type}`}>
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <p className="bb-wrp-day-label">{d.label}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* ── Campus prize (full-bleed dark section) ── */}
      <section className="bb-wrp-prize">
        <div className="bb-shell bb-shell--wide bb-wrp-prize-grid">
          <div className="bb-wrp-prize-copy">
            <p className="bb-eyebrow bb-wrp-prize-kicker">{BUBBA_WRP_CAMPUS_PRIZE.kicker}</p>
            <h2 className="bb-wrp-prize-title">
              <span>{BUBBA_WRP_CAMPUS_PRIZE.title[0]}</span>
              <span className="bb-wrp-prize-title-b">{BUBBA_WRP_CAMPUS_PRIZE.title[1]}</span>
            </h2>
            <p className="bb-wrp-prize-body">{BUBBA_WRP_CAMPUS_PRIZE.body}</p>

            <div className="bb-wrp-ticket">
              <p className="bb-wrp-ticket-label">{BUBBA_WRP_CAMPUS_PRIZE.ticket.label}</p>
              <p className="bb-wrp-ticket-headline">{BUBBA_WRP_CAMPUS_PRIZE.ticket.headline}</p>
              <p className="bb-wrp-ticket-sub">{BUBBA_WRP_CAMPUS_PRIZE.ticket.sub}</p>
              <span className="bb-wrp-ticket-pill">{BUBBA_WRP_CAMPUS_PRIZE.ticket.pill}</span>
            </div>
            <p className="bb-wrp-annotation">{BUBBA_WRP_CAMPUS_PRIZE.annotation}</p>
          </div>

          <div className="bb-wrp-prize-markets">
            <div className="bb-wrp-prize-markets-head">
              <div>
                <p className="bb-wrp-prize-markets-kicker">{BUBBA_WRP_CAMPUS_PRIZE.marketsKicker}</p>
                <p className="bb-wrp-prize-markets-kicker bb-wrp-prize-markets-kicker--blue">
                  {BUBBA_WRP_CAMPUS_PRIZE.premiumKicker}
                </p>
              </div>
              <Link href="/waitlist/start" className="bb-wrp-request">
                {BUBBA_WRP_CAMPUS_PRIZE.requestCta}
              </Link>
            </div>

            {markets.map((m) => (
              <MarketCard key={m.id} marketId={m.id} name={m.name} />
            ))}
          </div>
        </div>
      </section>

      <div className="bb-shell bb-wrp">
        {/* ── How it works ── */}
        <section className="bb-wrp-how">
          <p className="bb-eyebrow">How it works</p>
          <ul className="bb-wrp-how-list">
            {BUBBA_WRP_HOW_IT_WORKS.map((item) => {
              const Icon = HOW_IT_WORKS_ICONS[item.key as keyof typeof HOW_IT_WORKS_ICONS];
              return (
                <li key={item.key}>
                  <span className="bb-wrp-how-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.6} />
                  </span>
                  <p className="bb-wrp-how-title">{item.title}</p>
                  <p className="bb-wrp-how-body">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Prizes carousel ── */}
        <section className="bb-wrp-prizes">
          <p className="bb-eyebrow">{BUBBA_WRP_PRIZES.kicker}</p>
          <h2 className="bb-wrp-prizes-title">{BUBBA_WRP_PRIZES.title}</h2>

          <div className="bb-wrp-prizes-row">
            <div className="bb-wrp-grand">
              <span className="bb-wrp-grand-badge">{BUBBA_WRP_PRIZES.grand.label}</span>
              <div className="bb-wrp-grand-art" aria-hidden="true">
                {BUBBA_WRP_PRIZES.grand.art ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={BUBBA_WRP_PRIZES.grand.art} alt="" />
                ) : null}
              </div>
              <p className="bb-wrp-grand-name">{BUBBA_WRP_PRIZES.grand.name}</p>
              <button type="button" className="bb-wrp-grand-cta">
                {BUBBA_WRP_PRIZES.grand.cta}
              </button>
            </div>

            {BUBBA_WRP_PRIZES.items.map((item) => (
              <div className="bb-wrp-prize-item" key={item.id}>
                <span className="bb-wrp-prize-points">{item.points}</span>
                <div className="bb-wrp-prize-art" aria-hidden="true">
                  {item.art ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.art} alt="" />
                  ) : null}
                </div>
                <p className="bb-wrp-prize-name">{item.name}</p>
                <p className="bb-wrp-prize-sub">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Closing banner ── */}
      <section className="bb-wrp-closer">
        <div className="bb-shell bb-wrp-closer-row">
          <div>
            <h2 className="bb-wrp-closer-title">{BUBBA_WRP_CLOSER.title}</h2>
            <p className="bb-wrp-closer-sub">{BUBBA_WRP_CLOSER.sub}</p>
          </div>
          <p className="bb-wrp-closer-note">{BUBBA_WRP_CLOSER.annotation}</p>
          <Link href={BUBBA_WRP_CLOSER.cta.href} className="bb-wrp-closer-cta">
            {BUBBA_WRP_CLOSER.cta.label}
            <ArrowRight size={16} strokeWidth={2.1} />
          </Link>
        </div>
      </section>
    </BubbaShell>
  );
}
