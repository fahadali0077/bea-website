import type { Metadata } from "next";

import { YoureInStep } from "@/app/components/launch/YoureInStep";

export const metadata: Metadata = {
  title: "You're In | Bea Ambassador Onboarding",
};

export default function YoureIn() {
  return <YoureInStep />;
}
