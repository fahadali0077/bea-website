"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { useListPublicAmbassadorsQuery } from "@/features/api/apiSlice";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { joinStepHref, joinStepIndex } from "@/lib/join";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinFail } from "./JoinFail";
import { JoinShell } from "./JoinShell";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function JoinAmbassador() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector((s) => s.waitlist.form);

  const { data, isLoading, isError, refetch } = useListPublicAmbassadorsQuery({
    marketId: form.marketId ?? undefined,
    schoolId: form.schoolId ?? undefined,
  });
  const ambassadors = data ?? [];

  return (
    <JoinShell
      slug="ambassador"
      skip={{
        label: "I wasn't invited by an ambassador",
        onClick: () => {
          dispatch(updateWaitlistForm({ referralCode: null }));
          router.push(joinStepHref(joinStepIndex("ambassador") + 1));
        },
      }}
    >
      {isError ? (
        <JoinFail what="ambassadors" onRetry={() => void refetch()} />
      ) : isLoading ? (
        <ul className="jn-amb">
          {[0, 1, 2].map((i) => (
            <li key={i} className="jn-amb-row jn-amb-row--ghost" />
          ))}
        </ul>
      ) : ambassadors.length === 0 ? (
        <p className="jn-empty">
          No ambassadors listed for this campus yet — carry on below.
        </p>
      ) : (
        <ul className="jn-amb">
          {ambassadors.map((a) => {
            const on = form.referralCode === a.referralCode;
            return (
              <li key={a.referralCode}>
                <button
                  type="button"
                  className={"jn-amb-row" + (on ? " jn-amb-row--on" : "")}
                  onClick={() =>
                    dispatch(
                      updateWaitlistForm({
                        referralCode: on ? null : a.referralCode,
                      }),
                    )
                  }
                  aria-pressed={on}
                >
                  <span className="jn-amb-badge" aria-hidden="true">
                    {initials(a.fullName)}
                  </span>
                  <span className="jn-amb-id">
                    <span className="jn-amb-name">{a.fullName}</span>
                    {a.schoolName ? (
                      <span className="jn-amb-school">{a.schoolName}</span>
                    ) : null}
                  </span>
                  {on ? (
                    <span className="jn-amb-tick" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </JoinShell>
  );
}
