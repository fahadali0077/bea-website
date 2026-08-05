import type { Metadata } from "next";

import { RoleStep } from "@/app/components/launch/RoleStep";

export const metadata: Metadata = {
  title: "The Role | Bea Ambassador Onboarding",
};

export default function TheRole() {
  return <RoleStep />;
}