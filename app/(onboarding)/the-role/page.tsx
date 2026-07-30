import type { Metadata } from "next";

import { SchoolStep } from "@/app/components/launch/SchoolStep";

export const metadata: Metadata = {
  title: "The Role | Bea Ambassador Onboarding",
};

export default function TheRole() {
  return <SchoolStep />;
}
