"use client";

import React from "react";
import {
  ArrowRight,
  Building2,
  Gift,
  Globe,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { useRedeemRewardMutation } from "@/features/api/apiSlice";
import { useRewardsContent } from "./useRewardsContent";

const RANK_ICONS = {
  campus: GraduationCap,
  market: Building2,
  national: Globe,
} as const;

export function RewardsDesktop() {
  const { content: c, hasRewards, isLoading, isError, errorMessage, refetch } =
    useRewardsContent();
  const [redeemReward, { isLoading: isRedeeming, originalArgs }] =
    useRedeemRewardMutation();

  const handleRedeem = async (rewardId: string | null) => {
    if (!rewardId) return;
    try {
      await redeemReward(rewardId).unwrap();
    } catch {
      // Error surfaces via the RewardProgress refetch; card state updates itself.
    }
  };

  return (
    <div style={{ width: "100%", fontFamily: "var(--font-sans, 'Inter', sans-serif)" }}>

      {/* ── TOP ROW: Title block + Your Points card ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "32px", marginBottom: "32px" }}>

        {/* Left: Title + subtitle */}
        <div style={{ flex: "1 1 0" }}>
          <h1
            style={{
              fontFamily: "var(--font-canela, Georgia, serif)",
              fontSize: "48px",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "#1a1a1a",
              margin: 0,
              marginBottom: "10px",
            }}
          >
            {c.title}
          </h1>
          <div style={{ color: "#6b6560", fontSize: "15px", lineHeight: 1.55 }}>
            {c.subtitle.map((line, idx) => (
              <p key={idx} style={{ margin: 0 }}>{line}</p>
            ))}
          </div>
        </div>

        {/* Right: Your Points card */}
        <div className="card" style={{ width: "300px", flexShrink: 0, padding: "20px 22px" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#9a8a78",
              textTransform: "uppercase",
            }}
          >
            {c.points.eyebrow}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  lineHeight: 1,
                }}
              >
                {c.points.value}
              </p>
              <div
                style={{
                  height: "6px",
                  background: "#ece8e4",
                  borderRadius: "99px",
                  overflow: "hidden",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${c.points.percent}%`,
                    background: "#4a3428",
                    borderRadius: "99px",
                  }}
                />
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#9a8a78" }}>
                {c.points.note}
              </p>
            </div>
            <div
              style={{
                marginLeft: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#faf0eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d05038",
                }}
                aria-hidden
              >
                <Gift size={20} strokeWidth={1.5} />
              </span>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#4a3429",
                  textDecoration: "underline",
                  whiteSpace: "nowrap",
                }}
              >
                {c.points.historyLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED REWARDS heading row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 600,
            color: "#1a1a1a",
          }}
        >
          {c.featured.heading}
        </h2>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#5a5550",
          }}
        >
          {c.featured.viewAll}
          <ArrowRight size={15} strokeWidth={1.75} />
        </button>
      </div>

      {/* States: the board is empty until an admin creates a visible reward. */}
      {isLoading && (
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#8a8078" }}>
          Loading your rewards...
        </p>
      )}

      {isError && (
        <div style={{ margin: "0 0 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#8a8078" }}>{errorMessage}</p>
          <button
            type="button"
            onClick={() => refetch()}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontSize: "14px", fontWeight: 700, color: "#4a3429", textDecoration: "underline",
            }}
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && !hasRewards && (
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#8a8078" }}>
          No rewards are available yet. Check back soon.
        </p>
      )}

      {/* ── FEATURED REWARDS – 3 column cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {c.featured.rewards.map((r) => (
          <div
            key={r.id ?? r.title}
            className="card"
            style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", minHeight: "220px" }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#f3e4d3",
                color: "#9a5a28",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "99px",
                marginBottom: "14px",
                alignSelf: "flex-start",
              }}
            >
              {r.status}
            </span>
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "22px",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.2,
              }}
            >
              {r.title}
            </h3>
            <div style={{ flex: 1 }}>
              {r.desc.map((d) => (
                <p
                  key={d}
                  style={{
                    margin: "0 0 2px",
                    fontSize: "13px",
                    color: "#6f6a64",
                    lineHeight: 1.5,
                  }}
                >
                  {d}
                </p>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#8a8078", fontWeight: 500 }}>
                {r.cost}
              </span>
              <button
                type="button"
                onClick={() => handleRedeem(r.id)}
                disabled={!r.canRedeem || isRedeeming}
                title={r.disabledReason ?? undefined}
                style={{
                  background: r.canRedeem ? "#1a1a1a" : "#c8c2bb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: r.canRedeem && !isRedeeming ? "pointer" : "not-allowed",
                }}
              >
                {isRedeeming && originalArgs === r.id ? "Redeeming..." : r.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── SCHOOL COMPETITION (full width) ── */}
      <div className="card" style={{ padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "#faf0eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d05038",
              flexShrink: 0,
            }}
            aria-hidden
          >
            <Trophy size={26} strokeWidth={1.5} />
          </span>
          <div>
            <p
              style={{
                margin: "0 0 3px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9a8a78",
              }}
            >
              {c.school.eyebrow}
            </p>
            <p style={{ margin: "0 0 2px", fontSize: "14px", color: "#5a5550" }}>
              {c.school.desc}
            </p>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>
              {c.school.prize}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "60px",
            background: "#ede8e1",
            margin: "0 28px",
            flexShrink: 0,
          }}
        />

        <div>
          <p
            style={{
              margin: "0 0 3px",
              fontSize: "12px",
              color: "#9a8a78",
              fontWeight: 500,
            }}
          >
            {c.school.leaderLabel}
          </p>
          <p style={{ margin: "0 0 2px", fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>
            {c.school.leaderName}
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "#5a5550", fontWeight: 500 }}>
            {c.school.leaderPts}
          </p>
        </div>
      </div>

      {/* ── PROMPT POINTS BREAKDOWN (full width) ── */}
      <div className="card" style={{ padding: "22px 28px", display: "flex", alignItems: "flex-start", gap: "0", marginBottom: "16px" }}>
        {/* Label column */}
        <div style={{ minWidth: "200px", paddingRight: "32px" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#9a8a78",
            }}
          >
            {c.prompts.eyebrow}
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b6560" }}>
            {c.prompts.desc}
          </p>
        </div>

        {/* Winner columns */}
        <div style={{ flex: 1, display: "flex", gap: "0" }}>
          {c.prompts.groups.map((g, i) => {
            const Icon = RANK_ICONS[g.icon];
            return (
              <div
                key={g.label}
                style={{
                  flex: 1,
                  borderLeft: "1px solid #ede8e1",
                  paddingLeft: "24px",
                  paddingRight: i < c.prompts.groups.length - 1 ? "24px" : "0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#faf0eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#d05038",
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
                    {g.label}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {g.places.map((p) => (
                    <span key={p} style={{ fontSize: "13px", color: "#5a5550" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM ROW: Ways to earn (×2) + Your standing ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Ways to earn – col 1 */}
        <div className="card" style={{ padding: "22px 22px" }}>
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#1a1a1a",
            }}
          >
            {c.earn.heading}
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {c.earn.items.map((it, i) => (
              <li
                key={it.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  paddingTop: i === 0 ? "0" : "12px",
                  paddingBottom: i < c.earn.items.length - 1 ? "12px" : "0",
                  borderBottom: i < c.earn.items.length - 1 ? "1px solid #ede8e1" : "none",
                }}
              >
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
                    {it.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#8a8078", lineHeight: 1.4 }}>
                    {it.desc}
                  </p>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    background: "#f3e4d3",
                    color: "#9a5a28",
                    fontSize: "13px",
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: "99px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.points}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ways to earn – col 2 (duplicate, matching design) */}
        <div className="card" style={{ padding: "22px 22px" }}>
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#1a1a1a",
            }}
          >
            {c.earn.heading}
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {c.earn.items.map((it, i) => (
              <li
                key={it.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  paddingTop: i === 0 ? "0" : "12px",
                  paddingBottom: i < c.earn.items.length - 1 ? "12px" : "0",
                  borderBottom: i < c.earn.items.length - 1 ? "1px solid #ede8e1" : "none",
                }}
              >
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
                    {it.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#8a8078", lineHeight: 1.4 }}>
                    {it.desc}
                  </p>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    background: "#f3e4d3",
                    color: "#9a5a28",
                    fontSize: "13px",
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: "99px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.points}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Your standing – col 3 */}
        <div className="card" style={{ padding: "22px 22px" }}>
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#1a1a1a",
            }}
          >
            {c.standing.heading}
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {c.standing.ranks.map((r, i) => {
              const Icon = RANK_ICONS[r.icon];
              return (
                <li
                  key={r.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: i === 0 ? "0" : "12px",
                    paddingBottom: i < c.standing.ranks.length - 1 ? "12px" : "0",
                    borderBottom: i < c.standing.ranks.length - 1 ? "1px solid #ede8e1" : "none",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "#faf0eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#d05038",
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    <Icon size={17} strokeWidth={1.5} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
                      {r.title}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#8a8078", lineHeight: 1.4 }}>
                      {r.desc}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      flexShrink: 0,
                    }}
                  >
                    {r.value}
                  </span>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            style={{
              marginTop: "16px",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#4a3429",
            }}
          >
            {c.standing.cta}
            <ArrowRight size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
