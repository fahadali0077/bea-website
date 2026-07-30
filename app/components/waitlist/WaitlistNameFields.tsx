"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type Props = {
  variant: "mobile" | "desktop";
};

export type WaitlistNameFieldsHandle = {
  focusInvalid: () => void;
};

function getInvalidField(form: { fullName: string; age: string }) {
  if (!form.fullName.trim()) {
    return "firstName" as const;
  }

  if (!form.age.trim()) {
    return "age" as const;
  }

  const age = Number(form.age);
  if (Number.isNaN(age) || age < 13 || age > 120) {
    return "age" as const;
  }

  return null;
}

export const WaitlistNameFields = forwardRef<WaitlistNameFieldsHandle, Props>(
  function WaitlistNameFields({ variant }, ref) {
    const dispatch = useAppDispatch();
    const form = useAppSelector(selectWaitlistForm);
    const isDesktop = variant === "desktop";

    const firstNameRef = useRef<HTMLInputElement>(null);
    const ageRef = useRef<HTMLInputElement>(null);
    const [invalidField, setInvalidField] = useState<"firstName" | "age" | null>(
      null,
    );

    const firstNameId = isDesktop ? "firstName-desktop" : "firstName-mobile";
    const ageId = isDesktop ? "age-desktop" : "age-mobile";

    const focusField = (field: "firstName" | "age") => {
      setInvalidField(field);

      window.requestAnimationFrame(() => {
        const input = field === "firstName" ? firstNameRef.current : ageRef.current;
        input?.scrollIntoView({ behavior: "smooth", block: "center" });
        input?.focus({ preventScroll: true });
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        focusInvalid() {
          const field = getInvalidField(form);
          if (field) {
            focusField(field);
          }
        },
      }),
      [form],
    );

    const clearInvalid = (field: "firstName" | "age") => {
      if (invalidField === field) {
        setInvalidField(null);
      }
    };

    const firstNameClassName = isDesktop
      ? "wld-step4-input"
      : "waitlist-underline-input";
    const ageClassName = firstNameClassName;

    const firstNameWrapClass = isDesktop
      ? "wld-step4-field"
      : "waitlist-underline-field";
    const ageWrapClass = firstNameWrapClass;

    const labelClassName = isDesktop ? "wld-step4-label" : "waitlist-field-label";

    return (
      <div className={isDesktop ? "wld-step4-fields" : undefined}>
        <div
          className={
            firstNameWrapClass +
            (invalidField === "firstName" ? " waitlist-name-field--invalid" : "")
          }
        >
          <label className={labelClassName} htmlFor={firstNameId}>
            {isDesktop ? "First name" : "First name"}
          </label>
          <input
            ref={firstNameRef}
            id={firstNameId}
            type="text"
            className={
              firstNameClassName +
              (invalidField === "firstName" ? " waitlist-field--highlight" : "")
            }
            placeholder="Your first name"
            autoComplete="given-name"
            value={form.fullName}
            aria-invalid={invalidField === "firstName"}
            onChange={(event) => {
              clearInvalid("firstName");
              dispatch(updateWaitlistForm({ fullName: event.target.value }));
            }}
          />
          {invalidField === "firstName" ? (
            <p className="waitlist-name-field-hint" role="status">
              First name is required.
            </p>
          ) : null}
        </div>

        <div
          className={
            ageWrapClass +
            (invalidField === "age" ? " waitlist-name-field--invalid" : "")
          }
        >
          <label className={labelClassName} htmlFor={ageId}>
            {isDesktop ? "How old are you?" : "Age"}
          </label>
          <input
            ref={ageRef}
            id={ageId}
            type="number"
            className={
              ageClassName + (invalidField === "age" ? " waitlist-field--highlight" : "")
            }
            placeholder="Your age"
            inputMode="numeric"
            min={13}
            max={120}
            value={form.age}
            aria-invalid={invalidField === "age"}
            onChange={(event) => {
              clearInvalid("age");
              dispatch(updateWaitlistForm({ age: event.target.value }));
            }}
          />
          {invalidField === "age" ? (
            <p className="waitlist-name-field-hint" role="status">
              {!form.age.trim()
                ? "Age is required."
                : "Enter a valid age between 13 and 120."}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);
