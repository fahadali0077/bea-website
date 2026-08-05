import type { Metadata } from "next";

import { BubbaFaq } from "@/app/components/bubba/BubbaFaq";

import "@/styles/bubba.css";

export const metadata: Metadata = {
  title: "FAQ — Bubba",
  description:
    "Answers to the most common questions about Bubba — what makes it different, what it costs, and when it reaches your city.",
};

export default function FaqPage() {
  return <BubbaFaq />;
}
