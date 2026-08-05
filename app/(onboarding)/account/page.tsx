import type { Metadata } from "next";

import { AccountStep } from "@/app/components/launch/AccountStep";

export const metadata: Metadata = {
  title: "Create Account | Bea Ambassador Onboarding",
};

export default function Account() {
  return <AccountStep />;
}
