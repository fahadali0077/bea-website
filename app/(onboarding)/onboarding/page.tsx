import type { Metadata } from "next";

import { Welcome } from "@/app/components/launch/Welcome";

export const metadata: Metadata = {
  title: "Welcome | Bea Ambassador Onboarding",
};

export default function Onboarding() {
  return <Welcome />;
}
