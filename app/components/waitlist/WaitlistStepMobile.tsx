"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { joinWaitlist } from "@/features/waitlist/waitlist.slice";
import {
  selectWaitlistForm,
  selectWaitlistJoinError,
  selectWaitlistJoinStatus,
} from "@/features/waitlist/waitlist.selectors";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { WAITLIST_PAGE_CONTENT } from "@/lib/waitlist-page-content";
import { WAITLIST_ARTBOARDS, type WaitlistStepArtboardId } from "@/lib/waitlist";
import { validateWaitlistStep } from "@/lib/waitlist-validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistContinueButton } from "./WaitlistContinueButton";
import { WaitlistFieldError } from "./WaitlistFieldError";
import { WaitlistJoinErrorAlert } from "./WaitlistJoinErrorAlert";
import {
  WaitlistMarketFields,
  type WaitlistMarketFieldsHandle,
} from "./WaitlistMarketFields";
import {
  WaitlistNameFields,
  type WaitlistNameFieldsHandle,
} from "./WaitlistNameFields";
import { WaitlistSchoolFields } from "./WaitlistSchoolFields";
import { WaitlistStepShell } from "./WaitlistStepShell";

type Props = {
  artboardId: WaitlistStepArtboardId;
};

export function WaitlistStepMobile({ artboardId }: Props) {
  const content = WAITLIST_PAGE_CONTENT[artboardId];
  const meta = WAITLIST_ARTBOARDS[artboardId];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector(selectWaitlistForm);
  const joinStatus = useAppSelector(selectWaitlistJoinStatus);
  const joinError = useAppSelector(selectWaitlistJoinError);
  const [selectedCity, setSelectedCity] = useState<string | null>(form.marketId);
  const [stepError, setStepError] = useState<string | null>(null);
  const marketFieldsRef = useRef<WaitlistMarketFieldsHandle>(null);
  const nameFieldsRef = useRef<WaitlistNameFieldsHandle>(null);

  const handleContinue = async () => {
    const validationError = validateWaitlistStep(artboardId, form);
    if (validationError) {
      if (artboardId === "3") {
        marketFieldsRef.current?.focusSearchInvalid();
        return;
      }
      if (artboardId === "4") {
        nameFieldsRef.current?.focusInvalid();
        return;
      }
      setStepError(validationError);
      return;
    }

    setStepError(null);

    if (artboardId === "7") {
      const result = await dispatch(joinWaitlist());
      if (joinWaitlist.fulfilled.match(result)) {
        router.push(`/waitlist/8?position=${result.payload.waitlistPosition}`);
      }
      return;
    }

    router.push(content.cta.href);
  };

  return (
    <WaitlistStepShell
      artboardId={artboardId}
      backHref={meta.backHref!}
      title={content.title}
      subtitle={content.subtitle}
      titleSerif={content.titleSerif}
      footer={
        <>
          <WaitlistContinueButton
            label={content.cta.label}
            onContinue={handleContinue}
            loading={artboardId === "7" && joinStatus === "loading"}
          />
          <WaitlistFieldError message={stepError} />
          {joinError && artboardId === "7" ? <WaitlistJoinErrorAlert message={joinError} /> : null}
        </>
      }
    >
      {artboardId === "3" && (
        <WaitlistMarketFields
          ref={marketFieldsRef}
          variant="mobile"
          selectedId={selectedCity}
          onSelectId={setSelectedCity}
        />
      )}

      {artboardId === "4" && <WaitlistNameFields ref={nameFieldsRef} variant="mobile" />}

      {artboardId === "5" && (
        <WaitlistSchoolFields variant="mobile" error={stepError} />
      )}

      {artboardId === "7" && (
        <>
          <div className="waitlist-search-block">
            <label className="waitlist-field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="waitlist-box-input"
              placeholder="you@email.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                dispatch(updateWaitlistForm({ email: event.target.value }))
              }
            />
          </div>
        </>
      )}
    </WaitlistStepShell>
  );
}