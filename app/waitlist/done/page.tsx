import type { Metadata } from "next";

import { JoinDone } from "@/app/components/join/JoinDone";

import "@/styles/join.css";

export const metadata: Metadata = {
  title: "You're on the list — Bubba",
};

export default function JoinDonePage() {
  return <JoinDone />;
}
