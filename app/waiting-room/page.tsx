import type { Metadata } from "next";

import { BubbaWaitingRoomPage } from "@/app/components/bubba/BubbaWaitingRoomPage";

import "@/styles/bubba.css";

export const metadata: Metadata = {
  title: "The Waiting Room — Bubba",
  description:
    "Seven days of daily prompts, campus leaderboards, and prizes before Bubba opens in your city.",
};

export default function WaitingRoomPage() {
  return <BubbaWaitingRoomPage />;
}
