"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { BUBBA_MARKETS } from "@/lib/bubba-content";

import { BubbaFooter } from "./BubbaFooter";
import { BubbaNav } from "./BubbaNav";

export function BubbaCalendar() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="bb-page">
      <BubbaNav active="calendar" />

      <main className="bb-main">
        <div className="bb-shell bb-shell--wide">
          <header className="bb-cal-head">
            <p className="bb-eyebrow bb-eyebrow--muted">Launch calendar</p>
            <h1 className="bb-display bb-display--lg" style={{ marginTop: 14 }}>
              See when Bubba arrives.
            </h1>
            <p className="bb-cal-sub">
              <span className="bb-marker">
                We&apos;re launching in select markets this summer with a full
                rollout in the fall.
              </span>
            </p>
          </header>

          <ul className="bb-cal-list">
            {BUBBA_MARKETS.map((market, index) => {
              const open = openId === market.id;
              const panelId = `bb-cal-panel-${market.id}`;

              return (
                <li key={market.id} className="bb-cal-row">
                  <button
                    type="button"
                    className="bb-cal-btn"
                    onClick={() => setOpenId(open ? null : market.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                  >
                    <span className="bb-cal-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>
                      <span className="bb-cal-city">{market.city}</span>
                      <span className="bb-cal-state">{market.state}</span>
                    </span>

                    <span className="bb-cal-status bb-cal-mobile-hide">
                      <span className="bb-cal-track">
                        <span
                          className="bb-cal-fill"
                          style={{ width: `${market.progress}%` }}
                        />
                      </span>
                      <span className="bb-cal-status-text">
                        Almost there!{" "}
                        <span className="bb-cal-early">You&apos;re early.</span>
                      </span>
                    </span>

                    <span className="bb-cal-date">
                      <span className="bb-cal-month">{market.month}</span>
                      <span className="bb-cal-day">{market.day}</span>
                    </span>

                    <span
                      className={`bb-cal-chev${open ? " bb-cal-chev--open" : ""}`}
                      aria-hidden="true"
                    >
                      <ChevronDown size={20} strokeWidth={1.8} />
                    </span>
                  </button>

                  {open ? (
                    <div className="bb-cal-panel" id={panelId}>
                      <p className="bb-cal-panel-body">{market.detail}</p>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      <BubbaFooter />
    </div>
  );
}
