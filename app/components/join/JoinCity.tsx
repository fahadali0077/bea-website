"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { useListMarketsQuery } from "@/features/api/apiSlice";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { cityArt, joinStepHref, joinStepIndex } from "@/lib/join";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinFail } from "./JoinFail";
import { JoinSearchSkeleton } from "./JoinLoading";
import { JoinShell } from "./JoinShell";

/** "Boston" + "MA" reads as "Boston, MA" under the name in the chosen row. */
function where(city: string | null, state: string | null) {
  return [city, state].filter(Boolean).join(", ") || null;
}

export function JoinCity() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector((s) => s.waitlist.form);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<string | null>(null);

  /* The card rail always shows the featured markets — typing filters the
     dropdown, not the rail, so the cards don't vanish mid-search. */
  const {
    data: featured,
    isLoading,
    isError: featuredFailed,
    refetch: refetchFeatured,
  } = useListMarketsQuery({ limit: 12 });
  const cards = featured?.items ?? [];

  const {
    data: found,
    isFetching,
    isError: searchFailed,
  } = useListMarketsQuery(
    { search: search.trim(), limit: 6 },
    { skip: search.trim().length < 2 },
  );
  const results = found?.items ?? [];

  const choose = (id: string, name: string, place: string | null) => {
    dispatch(
      updateWaitlistForm({
        marketId: id,
        marketName: name,
        skippedMarket: false,
      }),
    );
    setMeta(place);
    setSearch("");
  };

  const clear = () => {
    dispatch(
      updateWaitlistForm({ marketId: null, marketName: null, skippedMarket: false }),
    );
    setMeta(null);
  };

  const showResults = search.trim().length >= 2 && !form.marketId;

  return (
    <JoinShell
      slug="city"
      canContinue={Boolean(form.marketId)}
      skip={{
        label: "Continue without a market",
        onClick: () => {
          dispatch(
            updateWaitlistForm({
              marketId: null,
              marketName: null,
              skippedMarket: true,
            }),
          );
          setMeta(null);
          router.push(joinStepHref(joinStepIndex("city") + 1));
        },
      }}
    >
      {featuredFailed ? (
        <JoinFail what="cities" onRetry={() => void refetchFeatured()} />
      ) : null}

      <ul className="jn-cities" aria-busy={isLoading || undefined}>
        {isLoading
          ? [0, 1, 2, 3].map((i) => (
              <li key={i} className="jn-city jn-city--ghost" aria-hidden="true" />
            ))
          : cards.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={
                    "jn-city" + (form.marketId === m.id ? " jn-city--on" : "")
                  }
                  onClick={() => choose(m.id, m.name, where(m.city, m.state))}
                  aria-pressed={form.marketId === m.id}
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
        role="combobox"
        aria-expanded={showResults}
        aria-controls="jn-city-results"
      />

      {showResults ? (
        searchFailed ? (
          <ul className="jn-results" id="jn-city-results" role="listbox">
            <li className="jn-results-note">
              Search is unavailable right now. Try again in a moment.
            </li>
          </ul>
        ) : isFetching && results.length === 0 ? (
          <div id="jn-city-results">
            <JoinSearchSkeleton />
          </div>
        ) : results.length === 0 ? (
          <ul className="jn-results" id="jn-city-results" role="listbox">
            <li className="jn-results-note">
              No market matches &ldquo;{search.trim()}&rdquo; yet.
            </li>
          </ul>
        ) : (
          <ul
            className={
              "jn-results" + (isFetching ? " jn-results--busy" : "")
            }
            id="jn-city-results"
            role="listbox"
            aria-busy={isFetching || undefined}
          >
            {results.map((m) => (
              <li key={m.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => choose(m.id, m.name, where(m.city, m.state))}
                >
                  <span className="jn-result-name">{m.name}</span>
                  {where(m.city, m.state) ? (
                    <span className="jn-result-meta">
                      {where(m.city, m.state)}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {/* Whatever the route in — card or dropdown — the choice reads back
          the same way, with a clear affordance. */}
      {form.marketId ? (
        <div className="jn-chosen">
          <span>
            <span className="jn-chosen-name">{form.marketName}</span>
            {meta ? <span className="jn-chosen-meta">{meta}</span> : null}
          </span>
          <button type="button" onClick={clear} aria-label="Clear city">
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      ) : null}
    </JoinShell>
  );
}
