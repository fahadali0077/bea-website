"use client";

import React from 'react';
import {
  ArrowRight,
  Building2,
  Gift,
  Globe,
  GraduationCap,
  Trophy,
} from "lucide-react";
import "@/styles/waitlist.css";
import { useRedeemRewardMutation } from "@/features/api/apiSlice";
import { useRewardsContent } from "./useRewardsContent";

const RANK_ICONS = {
  campus: GraduationCap,
  market: Building2,
  national: Globe,
} as const;

export function RewardsMobile() {
  const { content: c, hasRewards, isLoading, isError, errorMessage, refetch } =
    useRewardsContent();
  const [redeemReward, { isLoading: isRedeeming, originalArgs }] =
    useRedeemRewardMutation();

  const handleRedeem = async (rewardId: string | null) => {
    if (!rewardId) return;
    try {
      await redeemReward(rewardId).unwrap();
    } catch {
      // Error surfaces via the RewardProgress refetch.
    }
  };

  return (
    <div className="waitlist-root" style={{ background: 'transparent', minHeight: 'auto' }}>
      <div className="waitlist-prizes-mobile mx-auto" style={{ padding: '0 0 56px', maxWidth: '480px' }}>

        {/* YOUR POINTS (Styled like Invite Progress card) */}
        <div className="waitlist-points-card card--muted" style={{ padding: '18px md:padding-24px' }}>
          <div className="waitlist-points-main">
            <p className="waitlist-points-eyebrow" style={{ color: '#3D2C24', fontWeight: 600 }}>{c.points.eyebrow}</p>
            <p className="waitlist-points-value" style={{ color: '#1a1a1a', fontWeight: 'bold' }}>{c.points.value}</p>
            <div className="waitlist-points-bar" style={{ background: '#ece8e4' }}>
              <div
                className="waitlist-points-fill"
                style={{ width: `${c.points.percent}%`, background: '#4a3428' }}
              />
            </div>
            <p className="waitlist-points-note" style={{ color: '#8a8078' }}>{c.points.note}</p>
          </div>
          <div className="waitlist-points-aside">
            <span className="waitlist-points-gift" style={{ background: '#faf0eb', border: '1px solid #faf0eb', color: '#d05038' }} aria-hidden>
              <Gift size={22} strokeWidth={1.5} />
            </span>
            <button type="button" className="waitlist-points-history" style={{ color: '#4a3429', textDecoration: 'underline', fontWeight: 'bold' }}>
              {"c.points.historyLabel"}
            </button>
          </div>
        </div>

        {/* Featured rewards */}
        <div className="waitlist-prizes-sectionhead" style={{ marginTop: '28px' }}>
          <h2 className="waitlist-card-heading" style={{ color: '#1a1a1a' }}>{c.featured.heading}</h2>
          <button type="button" className="waitlist-prizes-viewall">
            {c.featured.viewAll}
            <ArrowRight size={15} strokeWidth={1.75} />
          </button>
        </div>
        {isLoading && (
          <p style={{ fontSize: '14px', color: '#8a8078', margin: '0 0 12px' }}>Loading your rewards...</p>
        )}
        {isError && (
          <p style={{ fontSize: '14px', color: '#8a8078', margin: '0 0 12px' }}>
            {errorMessage}{' '}
            <button
              type="button"
              onClick={() => refetch()}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 700, color: '#4a3429', textDecoration: 'underline' }}
            >
              Try again
            </button>
          </p>
        )}
        {!isLoading && !isError && !hasRewards && (
          <p style={{ fontSize: '14px', color: '#8a8078', margin: '0 0 12px' }}>
            No rewards are available yet. Check back soon.
          </p>
        )}
        <div className="waitlist-reward-list">
          {c.featured.rewards.map((r) => (
            <div key={r.id ?? r.title} className="waitlist-reward-card card" style={{ borderRadius: '12px' }}>
              <span className="waitlist-reward-badge" style={{ background: '#f2eee7', color: '#827357' }}>{r.status}</span>
              <h3 className="waitlist-reward-title" style={{ color: '#1a1a1a' }}>{r.title}</h3>
              <p className="waitlist-reward-desc" style={{ color: '#6f6a64' }}>
                {r.desc.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </p>
              <div className="waitlist-reward-foot">
                <span className="waitlist-reward-cost" style={{ color: '#4a3429', fontWeight: 600 }}>{r.cost}</span>
                <button
                  type="button"
                  className="waitlist-reward-redeem"
                  onClick={() => handleRedeem(r.id)}
                  disabled={!r.canRedeem || isRedeeming}
                  title={r.disabledReason ?? undefined}
                  style={{ background: r.canRedeem ? '#1a1a1a' : '#c8c2bb', color: '#fff' }}
                >
                  {isRedeeming && originalArgs === r.id ? 'Redeeming...' : r.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* School competition */}
        <div className="waitlist-info-card card--muted" style={{ marginTop: '20px' }}>
          <div className="waitlist-school-row">
            <span className="waitlist-info-icon" style={{ background: '#faf0eb', color: '#d05038' }} aria-hidden>
              <Trophy size={22} strokeWidth={1.5} />
            </span>
            <div>
              <p className="waitlist-info-eyebrow" style={{ color: '#8b7355' }}>{c.school.eyebrow}</p>
              <p className="waitlist-info-text" style={{ color: '#5a5550' }}>{c.school.desc}</p>
              <p className="waitlist-info-strong" style={{ color: '#1a1a1a' }}>{c.school.prize}</p>
            </div>
          </div>
          <div className="waitlist-info-divider" style={{ background: '#e3ded6' }} />
          <div>
            <p className="waitlist-info-eyebrow" style={{ color: '#8b7355' }}>{c.school.leaderLabel}</p>
            <p className="waitlist-info-strong" style={{ color: '#1a1a1a' }}>{c.school.leaderName}</p>
            <p className="waitlist-info-strong" style={{ color: '#1a1a1a' }}>{c.school.leaderPts}</p>
          </div>
        </div>

        {/* Prompt points breakdown */}
        <div className="waitlist-info-card card--muted" style={{ marginTop: '20px' }}>
          <p className="waitlist-info-eyebrow" style={{ color: '#8b7355' }}>{c.prompts.eyebrow}</p>
          <p className="waitlist-info-text" style={{ color: '#5a5550' }}>{c.prompts.desc}</p>
          <div className="waitlist-prompt-groups">
            {c.prompts.groups.map((g) => {
              const Icon = RANK_ICONS[g.icon];
              return (
                <div key={g.label} className="waitlist-prompt-group" style={{ borderColor: '#e3ded6' }}>
                  <span className="waitlist-prompt-head" style={{ color: '#1a1a1a' }}>
                    <span className="waitlist-info-icon" style={{ background: '#faf0eb', color: '#d05038' }} aria-hidden>
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                    {g.label}
                  </span>
                  <span className="waitlist-prompt-places" style={{ color: '#5a5550' }}>
                    {g.places.map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ways to earn points */}
        <div className="waitlist-info-card card--muted" style={{ marginTop: '20px' }}>
          <h2 className="waitlist-card-heading" style={{ color: '#1a1a1a' }}>{c.earn.heading}</h2>
          <ul className="waitlist-earn-list">
            {c.earn.items.map((it) => (
              <li key={it.title} className="waitlist-earn-item" style={{ borderColor: '#e3ded6' }}>
                <div className="waitlist-earn-text">
                  <p className="waitlist-earn-title" style={{ color: '#1a1a1a' }}>{it.title}</p>
                  <p className="waitlist-earn-desc" style={{ color: '#5a5550' }}>{it.desc}</p>
                </div>
                <span className="waitlist-earn-points" style={{ color: '#d05038', fontWeight: 700 }}>{it.points}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Your standing */}
        <div className="waitlist-info-card card--muted" style={{ marginTop: '20px' }}>
          <h2 className="waitlist-card-heading" style={{ color: '#1a1a1a' }}>{c.standing.heading}</h2>
          <ul className="waitlist-earn-list">
            {c.standing.ranks.map((r) => {
              const Icon = RANK_ICONS[r.icon];
              return (
                <li key={r.title} className="waitlist-earn-item" style={{ borderColor: '#e3ded6' }}>
                  <span className="waitlist-info-icon" style={{ background: '#faf0eb', color: '#d05038' }} aria-hidden>
                    <Icon size={20} strokeWidth={1.5} />
                  </span>
                  <div className="waitlist-earn-text">
                    <p className="waitlist-earn-title" style={{ color: '#1a1a1a' }}>{r.title}</p>
                    <p className="waitlist-earn-desc" style={{ color: '#5a5550' }}>{r.desc}</p>
                  </div>
                  <span className="waitlist-standing-value" style={{ color: '#1a1a1a' }}>{r.value}</span>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="waitlist-prizes-viewall waitlist-standing-cta"
            style={{ color: '#4a3429', fontWeight: 700 }}
          >
            {c.standing.cta}
            <ArrowRight size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
