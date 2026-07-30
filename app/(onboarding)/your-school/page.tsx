import type { Metadata } from "next";

import { InviteStep } from "@/app/components/launch/InviteStep";

export const metadata: Metadata = {
  title: "Your School | Bea Ambassador Onboarding",
};

export default function YourSchool() {
  return <InviteStep />;
}
