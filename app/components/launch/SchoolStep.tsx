"use client";

import Link from "next/link";
import { ArrowRight, Tag, Gift, Users, Sprout } from "lucide-react";

import { SCHOOL_STEP, type SchoolIcon } from "@/lib/launch";

function SchoolIconGlyph({ icon }: { icon: SchoolIcon }) {
  switch (icon) {
    case "early-access":
      return <Tag size={19} strokeWidth={1.6} />;
    case "rewards":
      return <Gift size={19} strokeWidth={1.6} />;
    case "community":
      return <Users size={19} strokeWidth={1.6} />;
    case "impact":
      return <Sprout size={19} strokeWidth={1.6} />;
  }
}

export function SchoolStep() {
  const { eyebrow, titleLines, subtitle, items, cta, footnote } = SCHOOL_STEP;

  return (
    <section className="launch-step launch-step--role">
      <div className="launch-step-inner">
        <p className="launch-eyebrow">{eyebrow}</p>
        <h1 className="launch-title font-canela onboarding-heading">
          {titleLines.map((line, i) => (
            <span key={line}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="launch-subtitle">{subtitle}</p>

        <div className="launch-role-items">
          {items.map((item) => (
            <div key={item.title} className="launch-role-item">
              <span className="launch-role-icon">
                <SchoolIconGlyph icon={item.icon} />
              </span>
              <div>
                <p className="launch-role-title">{item.title}</p>
                <p className="launch-role-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href={cta.href} className="launch-cta cursor-pointer">
          <span>{cta.label}</span>
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>

        <p className="launch-footnote">
          <Link href={footnote.href}>{footnote.label}</Link>
        </p>
      </div>
    </section>
  );
}