"use client";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinShell } from "./JoinShell";

export function JoinBasics() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.waitlist.form);

  const age = Number(form.age);
  const ageOk = form.age.trim() === "" ? false : age >= 18 && age <= 120;

  return (
    <JoinShell
      slug="basics"
      canContinue={form.fullName.trim().length > 0 && ageOk}
    >
      <label className="jn-field">
        <span className="jn-field-label">First name</span>
        <input
          className="jn-input"
          type="text"
          autoComplete="given-name"
          value={form.fullName}
          onChange={(e) => dispatch(updateWaitlistForm({ fullName: e.target.value }))}
        />
      </label>

      <label className="jn-field mt-[48.63px]">
        <span className="jn-field-label mb-[9.97px]">Age</span>
        <input
          className="jn-input"
          type="number"
          inputMode="numeric"
          min={18}
          max={120}
          value={form.age}
          onChange={(e) => dispatch(updateWaitlistForm({ age: e.target.value }))}
        />
      </label>

      {form.age.trim() !== "" && !ageOk ? (
        <p className="jn-hint">You need to be 18 or over to join Bubba.</p>
      ) : null}
    </JoinShell>
  );
}
