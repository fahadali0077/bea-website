"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { joinWaitlist } from "@/features/waitlist/waitlist.slice";
import {
  selectWaitlistForm,
  selectWaitlistJoinError,
  selectWaitlistJoinStatus,
} from "@/features/waitlist/waitlist.selectors";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { WAITLIST_PAGE_CONTENT } from "@/lib/waitlist-page-content";
import { WAITLIST_ARTBOARDS } from "@/lib/waitlist";
import { validateWaitlistStep } from "@/lib/waitlist-validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistFieldError } from "./WaitlistFieldError";
import { WaitlistJoinErrorAlert } from "./WaitlistJoinErrorAlert";

export function WaitlistEmailDesktop() {
  const content = WAITLIST_PAGE_CONTENT["7"];
  const meta = WAITLIST_ARTBOARDS["7"];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector(selectWaitlistForm);
  const joinStatus = useAppSelector(selectWaitlistJoinStatus);
  const joinError = useAppSelector(selectWaitlistJoinError);
  const [stepError, setStepError] = useState<string | null>(null);

  const handleJoin = async () => {
    const validationError = validateWaitlistStep("7", form);
    if (validationError) {
      setStepError(validationError);
      return;
    }

    setStepError(null);

    const result = await dispatch(joinWaitlist());
    if (joinWaitlist.fulfilled.match(result)) {
      router.push(`/waitlist/8?position=${result.payload.waitlistPosition}`);
    }
  };

  return (
    <div className="wld-step7-container">
      <div className="wld-step7-left">
        <div className="wld-step7-top">
          <Link href={meta.backHref!} className="wld-step7-back">
            <ArrowLeft size={24} strokeWidth={2} />
          </Link>
          <div className="wld-step7-progress">
            <div className="wld-step7-progress-bar wld-step7-progress-bar--active" />
            <div className="wld-step7-progress-bar wld-step7-progress-bar--active" />
            <div className="wld-step7-progress-bar wld-step7-progress-bar--active" />
            <div className="wld-step7-progress-bar wld-step7-progress-bar--active" />
          </div>
        </div>

        <div className="wld-step7-header">
          <h1 className="wld-step7-title">{content.title}</h1>
          <p className="wld-step7-subtitle">{content.subtitle}</p>
        </div>

        <div className="wld-step7-field-wrapper">
          <input
            id="email"
            type="email"
            className="wld-step7-input"
            placeholder="you@email.com"
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              dispatch(updateWaitlistForm({ email: event.target.value }))
            }
          />
        </div>

        <WaitlistFieldError message={stepError} />
        {joinError ? <WaitlistJoinErrorAlert message={joinError} /> : null}

        <div className="wld-step7-actions">
          <button
            type="button"
            className="wld-step7-primary-btn"
            disabled={joinStatus === "loading"}
            onClick={() => void handleJoin()}
          >
            {joinStatus === "loading" ? "Joining…" : content.cta.label}
            <ArrowRight size={20} strokeWidth={2} style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}