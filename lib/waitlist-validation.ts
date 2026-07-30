import type { WaitlistFormState } from "@/features/waitlist/waitlist.types";
import type { WaitlistStepArtboardId } from "@/lib/waitlist";

export function validateWaitlistStep(
  step: WaitlistStepArtboardId,
  form: WaitlistFormState,
): string | null {
  switch (step) {
    case "3":
      if (!form.marketId || !form.marketName) {
        return "Please select a market to continue.";
      }
      return null;
    case "4":
      if (!form.fullName.trim()) {
        return "First name is required.";
      }
      if (!form.age.trim()) {
        return "Age is required.";
      }
      {
        const age = Number(form.age);
        if (Number.isNaN(age) || age < 16 || age > 100) {
          return "Enter a valid age between 16 and 100.";
        }
      }
      return null;
    case "5":
      if (form.notInSchool) {
        return null;
      }
      if (!form.schoolId || !form.schoolName) {
        return "Select a school or choose “I'm not currently in school”.";
      }
      return null;
    case "7": {
      if (!form.email.trim()) {
        return "Email is required.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        return "Enter a valid email address.";
      }
      return null;
    }
    default:
      return null;
  }
}

const JOIN_STEPS: WaitlistStepArtboardId[] = ["3", "4", "5", "7"];

export function validateWaitlistFormForJoin(
  form: WaitlistFormState,
): string | null {
  for (const step of JOIN_STEPS) {
    const error = validateWaitlistStep(step, form);
    if (error) {
      return error;
    }
  }

  if (!form.marketId) {
    return "Please select a market to continue.";
  }

  return null;
}

export function buildJoinWaitlistPayload(form: WaitlistFormState) {
  return {
    email: form.email.trim(),
    fullName: form.fullName.trim(),
    age: Number(form.age),
    marketId: form.marketId!,
    schoolId: form.notInSchool ? undefined : (form.schoolId ?? undefined),
    referralCode: form.referralCode ?? undefined,
  };
}
