import type { Metadata } from "next";

import { WaitlistStartPage } from "@/app/components/waitlist/WaitlistStartPage";

export const metadata: Metadata = {
  title: "Join the waitlist — Bea",
};

export default function WaitlistStart() {
  return <WaitlistStartPage />;
}