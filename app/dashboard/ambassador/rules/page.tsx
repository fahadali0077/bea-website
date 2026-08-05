"use client";

import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  FileText,
  Flag,
  Mail,
  Network,
  Scale,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { AmbassadorGuard, AmbassadorPageHeader } from "../_components";

const RULES = [
  {
    title: "Eligibility",
    description:
      "The Bea Ambassador Competition is open to current students at participating campuses who are officially invited and selected as ambassadors.",
    icon: Flag,
  },
  {
    title: "How it works",
    description:
      "Ambassadors share their unique referral link to invite new users to join the Bea waitlist. Every verified sign-up through their link counts as one (1) invite.",
    icon: Users,
  },
  {
    title: "Scoring & Leaderboard",
    description:
      "Invites are counted in real time and reflected on the leaderboard. Rankings are based on the total number of verified sign-ups during the competition period.",
    icon: Network,
  },
  {
    title: "Prizes",
    description:
      "The ambassador with the most verified sign-ups at the end of the competition wins the grand prize. Additional prizes are available at the campus, market, and national levels.",
    icon: Trophy,
  },
  {
    title: "Competition Period",
    description:
      "The competition period is displayed in the Overview and Calendar pages. All invites must be received before the competition end date and time.",
    icon: Calendar,
  },
  {
    title: "Fair Use",
    description:
      "Spam, misleading referrals, fraudulent activity, fake accounts, or any attempt to manipulate rankings may result in immediate disqualification. Bea reserves the right to remove invalid invites.",
    icon: ShieldCheck,
  },
  {
    title: "General",
    description:
      "Bea reserves the right to modify, suspend, or cancel the competition at any time. By participating, ambassadors agree to these official rules and Bea's Terms of Service.",
    icon: FileText,
  },
];

const SUMMARY_HIGHLIGHTS = [
  {
    label: "Competition Period",
    subtitle: "June 15 – Launch",
    icon: Calendar,
    color: "#ede2ea",
  },
  {
    label: "Who Can Participate",
    subtitle: "5–10 selected ambassadors per campus",
    icon: Flag,
    color: "#eaeee1",
  },
  {
    label: "How to Win",
    subtitle: "Get the most verified sign-ups. Direct + indirect invites.",
    icon: Users,
    color: "#e6eeee",
  },
  {
    label: "Top Prize",
    subtitle: "$24,000 + merch bundle",
    icon: Trophy,
    color: "#ede7ef",
  },
  {
    label: "Fair Play",
    subtitle: "No spam or fraudulant activity",
    icon: ShieldCheck,
    color: "#f8e6e2",
  },
];

const PASTEL_COLORS = ["#eaeee1", "#e6eeee", "#fdeedc", "#ede7ef", "#ede2ea", "#f8e6e2", "#e8e8e8"];

export default function AmbassadorRulesPage() {
  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Rules & Terms"
          subtitle="Please read the official rules and terms for the Bea Ambassador Competition."
        />

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5 md:p-7">
            {/*<h2 className="font-sfpro text-[13px] md:text-[16px] font-bold uppercase tracking-[0.14em] text-[#402b23]">
              Official Rules
            </h2>*/}

            <div className="mt-5 divide-y divide-neutral-200/70">
              {RULES.map((rule, index) => {
                const Icon = rule.icon;
                return (
                  <div key={rule.title} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <span
                      className="grid size-[54px] shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: PASTEL_COLORS[index % PASTEL_COLORS.length] }}
                    >
                      <Icon className="size-[25px] text-neutral-700" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-lato text-[18px] font-bold text-neutral-900">
                        {index + 1}. {rule.title}
                      </p>
                      <p className="mt-1 font-lato text-[14px] font-medium leading-relaxed text-neutral-600">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5">
              <h3 className="font-sfpro text-[18px] font-medium uppercase tracking-[0.14em] text-[#402b23]">
                Quick Summary
              </h3>
              <div className="mt-4 space-y-4">
                {SUMMARY_HIGHLIGHTS.map(({ icon: Icon, label, subtitle, color }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ backgroundColor: color }}>
                      <Icon className="size-5 text-[#584939]" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-lato text-[14px] font-bold text-[#000000]">{label}</p>
                      <p className="mt-0.5 font-lato text-[12px] font-medium leading-snug text-[#636664]">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5">
              <h3 className="font-sfpro text-[18px] font-medium uppercase tracking-[0.14em] text-[#402b23]">
                Questions
              </h3>
              <p className="mt-3 font-lato text-[12px] font-medium leading-relaxed text-neutral-600">
                Reach out to our team if you have any
                questions about the competition. 
              </p>
              <a
                href="#"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#dddddd] px-5 py-3 font-lato text-[12px] font-bold text-[#225a66] transition-opacity hover:opacity-90"
              >
                Contact Support
              </a>
            </section>

            <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5">
              <h3 className="font-sfpro text-[18px] font-medium uppercase tracking-[0.14em] text-[#402b23]">
                Legal
              </h3>
              <div className="mt-3 flex flex-col">
                <Link href="#" className="flex items-center justify-between py-4 font-lato text-[12px] font-bold text-[#225a66]">
                  <span className="flex items-center gap-2">
                    Terms of Service
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-neutral-400" />
                </Link>
                <Link href="#" className="flex items-center justify-between border-t border-neutral-200/70 py-4 font-lato text-[12px] font-bold text-[#225a66]">
                  <span className="flex items-center gap-2">
                    Privacy Policy
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-neutral-400" />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </AmbassadorGuard>
  );
}
