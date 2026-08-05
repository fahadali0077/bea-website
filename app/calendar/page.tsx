import type { Metadata } from "next";

import { BubbaCalendar } from "@/app/components/bubba/BubbaCalendar";

import "@/styles/bubba.css";

export const metadata: Metadata = {
  title: "Launch calendar — Bubba",
  description:
    "See when Bubba arrives in your city. Track every market, its launch status and its date.",
};

export default function CalendarPage() {
  return <BubbaCalendar />;
}
