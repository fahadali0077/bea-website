import type { Metadata } from "next";

import { VerifyEmailStep } from "@/app/components/launch/VerifyEmailStep";

export const metadata: Metadata = {
  title: "Verify Email | Bea Ambassador Onboarding",
};

export default function VerifyEmail() {
  return <VerifyEmailStep />;
}