import type { Metadata } from "next";

import { BubbaLanding } from "@/app/components/bubba/BubbaLanding";

import "@/styles/bubba.css";

export const metadata: Metadata = {
  title: "Bubba — Together, today.",
  description:
    "24 hours to chat. Bubba only shows recently active people and every conversation lasts a day. Join the waitlist before your city launches.",
};

export default function Home() {
  return <BubbaLanding />;
}
