import type { Metadata } from "next";

import { SchoolStep } from "@/app/components/launch/SchoolStep";

export const metadata: Metadata = {
  title: "Your School | Bea Ambassador Onboarding",
};

export default function YourSchool() {
  return <SchoolStep />;
}