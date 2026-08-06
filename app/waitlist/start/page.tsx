import type { Metadata } from "next";

import { JoinIntro } from "@/app/components/join/JoinIntro";

import "@/styles/join.css";

export const metadata: Metadata = {
  title: "Join the waitlist — Bubba",
  description:
    "Join the waitlist for early access to Bubba in your city.",
};

export default function JoinStartPage() {
  return <JoinIntro />;
}
