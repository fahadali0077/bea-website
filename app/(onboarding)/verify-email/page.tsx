import type { Metadata } from "next";

import { WaysToWin } from "@/app/components/launch/WaysToWin";

export const metadata: Metadata = {
  title: "Verify Email | Bea Ambassador Onboarding",
};

export default function VerifyEmail() {
  return <WaysToWin />;
}
