"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useListSchoolsQuery } from "@/features/api/apiSlice";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinShell } from "./JoinShell";

export function JoinCampus() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.waitlist.form);
  const [search, setSearch] = useState("");
  // The market line under a chosen school is display-only, so it lives here
  // rather than in the submitted form state.
  const [meta, setMeta] = useState<string | null>(null);

  const { data } = useListSchoolsQuery(
    { search: search.trim() || undefined, limit: 6 },
    { skip: search.trim().length < 2 },
  );
  const results = data?.items ?? [];

  const pick = (id: string, name: string, where: string | null) => {
    dispatch(
      updateWaitlistForm({ schoolId: id, schoolName: name, notInSchool: false }),
    );
    setMeta(where);
    setSearch("");
  };

  const clear = () => {
    dispatch(updateWaitlistForm({ schoolId: null, schoolName: null }));
    setMeta(null);
  };

  return (
    <JoinShell
      slug="campus"
      canContinue={Boolean(form.schoolId) || form.notInSchool}
    >
      <input
        className="jn-input"
        type="search"
        placeholder="Search school"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search school"
      />

      {results.length > 0 && !form.schoolId ? (
        <ul className="jn-results">
          {results.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => pick(s.id, s.name, s.market?.name ?? null)}
              >
                <span className="jn-result-name">{s.name}</span>
                {s.market?.name ? (
                  <span className="jn-result-meta">{s.market.name}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Selected school reads as a filled row with a clear affordance. */}
      {form.schoolId ? (
        <div className="jn-chosen">
          <span>
            <span className="jn-chosen-name">{form.schoolName}</span>
            {meta ? <span className="jn-chosen-meta">{meta}</span> : null}
          </span>
          <button type="button" onClick={clear} aria-label="Clear school">
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      ) : null}

      <p className="jn-or">
        <span>Or</span>
      </p>

      <button
        type="button"
        className={
          "jn-optout" + (form.notInSchool ? " jn-optout--on" : "")
        }
        onClick={() =>
          dispatch(
            updateWaitlistForm({
              notInSchool: !form.notInSchool,
              schoolId: null,
              schoolName: null,
            }),
          )
        }
        aria-pressed={form.notInSchool}
      >
        I&rsquo;m not currently in school
      </button>
    </JoinShell>
  );
}
