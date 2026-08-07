import type { JoinWaitlistResponse } from "@/lib/api/types";

export type WaitlistJoinStatus = "idle" | "loading" | "succeeded" | "failed";

export interface WaitlistFormState {
  email: string;
  fullName: string;
  age: string;
  marketId: string | null;
  marketName: string | null;
  /* "City, ST" — set alongside marketName so the done screen can show
     "in Boston, MA" without JoinCity's local search-result `meta` state,
     which unmounts before the flow reaches /waitlist/done. */
  marketPlace: string | null;
  skippedMarket: boolean;
  schoolId: string | null;
  schoolName: string | null;
  notInSchool: boolean;
  referralCode: string | null;
}

export interface WaitlistState {
  form: WaitlistFormState;
  joinStatus: WaitlistJoinStatus;
  joinError: string | null;
  joinResult: JoinWaitlistResponse | null;
  waitlistPosition: number | null;
}

export const initialWaitlistForm: WaitlistFormState = {
  email: "",
  fullName: "",
  age: "",
  marketId: null,
  marketName: null,
  marketPlace: null,
  skippedMarket: false,
  schoolId: null,
  schoolName: null,
  notInSchool: false,
  referralCode: null,
};

export const initialWaitlistState: WaitlistState = {
  form: initialWaitlistForm,
  joinStatus: "idle",
  joinError: null,
  joinResult: null,
  waitlistPosition: null,
};
