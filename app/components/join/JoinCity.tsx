"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useListMarketsQuery } from "@/features/api/apiSlice";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { cityArt, joinStepHref, joinStepIndex } from "@/lib/join";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinShell } from "./JoinShell";

export function JoinCity() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const selected = useAppSelector((s) => s.waitlist.form.marketId);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListMarketsQuery({
    search: search.trim() || undefined,
    limit: 12,
  });
  const markets = data?.items ?? [];

  const choose = (id: string, name: string) =>
    dispatch(updateWaitlistForm({ marketId: id, marketName: name }));

  return (
    <JoinShell
      slug="city"
      canContinue={Boolean(selected)}
      skip={{
        label: "Continue without a market",
        onClick: () => {
          dispatch(updateWaitlistForm({ marketId: null, marketName: null }));
          router.push(joinStepHref(joinStepIndex("city") + 1));
        },
      }}
    >
      {/* Horizontal card rail — the design lets the fourth card bleed off
          the right edge as an affordance that it scrolls. */}
      <ul className="jn-cities">
        {isLoading
          ? [0, 1, 2].map((i) => <li key={i} className="jn-city jn-city--ghost" />)
          : markets.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={
                    "jn-city" + (selected === m.id ? " jn-city--on" : "")
                  }
                  onClick={() => choose(m.id, m.name)}
                  aria-pressed={selected === m.id}
                >
                  <span className="jn-city-art" aria-hidden="true">
                    {cityArt(m.name) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cityArt(m.name) as string} alt="" />
                    ) : null}
                  </span>
                  <span className="jn-city-name">{m.name}</span>
                </button>
              </li>
            ))}
      </ul>

      <p className="jn-or-label">Or search any city</p>

      <input
        className="jn-input"
        type="search"
        placeholder="Search market"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search market"
      />
    </JoinShell>
  );
}
