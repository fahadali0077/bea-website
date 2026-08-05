"use client";

import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

type LaunchErrorModalProps = {
  message: string;
  onClose: () => void;
  actionLabel?: string;
};

/**
 * Popup shown for submission / server-side failures during onboarding.
 * Field-level validation does NOT use this — those render inline under the field.
 */
export function LaunchErrorModal({ message, onClose, actionLabel = "Try again" }: LaunchErrorModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="launch-modal-overlay" onClick={onClose}>
      <div
        className="launch-modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="launch-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="launch-modal-icon" aria-hidden="true">
          <AlertCircle size={22} strokeWidth={2} />
        </span>

        <p className="launch-modal-message" id="launch-modal-message">
          {message}
        </p>

        <button ref={closeRef} type="button" className="launch-modal-cta" onClick={onClose}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export default LaunchErrorModal;
