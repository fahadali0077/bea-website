"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Tag, Gift, Users, Sprout } from "lucide-react";

import { SCHOOL_STEP, type SchoolIcon } from "@/lib/launch";
import { useResendAmbassadorInviteMutation } from "@/features/api/apiSlice";

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

export function RoleStep() {
  const router = useRouter();
  const { eyebrow, titleLines, subtitle, items, cta, footnote } = SCHOOL_STEP;
  const [resendInvite] = useResendAmbassadorInviteMutation();
  const [navigating, setNavigating] = useState(false);

  // Continue does two things at once: send the verification email (its link
  // carries next=account, so clicking it drops the person straight onto the
  // Account step), and move on to the Verify Email step. The send is fired
  // without blocking navigation — a slow or failed email shouldn't stall
  // the flow, and Verify Email's own "Resend" link covers that case.
  const handleContinue = () => {
    if (navigating) return;
    setNavigating(true);

    const token = sessionStorage.getItem("ambassador_onboarding_token") ?? "";
    if (token) {
      void (async () => {
        try {
          await resendInvite(token).unwrap();
        } catch {
          // Swallow — Verify Email's own "Resend" link covers a failed send.
        }
      })();
    }

    router.push(cta.href);
  };

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

        <button type="button" className="launch-cta cursor-pointer" onClick={handleContinue} disabled={navigating}>
          <span>{cta.label}</span>
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <p className="launch-footnote">
          <Link href={footnote.href}>{footnote.label}</Link>
        </p>
      </div>
    </section>
  );
}